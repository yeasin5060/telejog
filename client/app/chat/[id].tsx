import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyConversationData, dummyMessagesMap } from '@/assets/assets';
import { Message } from '@/types';

// Quick reaction emojis
const QUICK_EMOJIS = ['👍', '❤️', '🔥', '😂', '🎉', '👏', '🥰', '🙏'];

// Full categorized emojis
const EMOJI_CATEGORIES = [
  {
    name: 'Smileys & Emotion',
    icon: '😀',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😛', '😜', '🤪', '😝', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😏', '🙄', '😬', '😌', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '🥴', '😵', '🤯', '🥳', '😎', '🤓', '🧐', '🥺', '😱', '😢', '😭', '😤', '😡', '🤬'],
  },
  {
    name: 'Popular Reactions',
    icon: '🔥',
    emojis: ['👍', '👎', '❤️', '🔥', '🥰', '👏', '😁', '🤔', '🤯', '😱', '🤬', '😢', '🎉', '🤩', '🤮', '💩', '🙏', '👌', '💯', '⚡', '🤣', '😍', '🚀', '🏆', '💔', '😴', '😭', '🤝', '✨', '☕', '💪', '👀'],
  },
  {
    name: 'Hands & Gestures',
    icon: '👍',
    emojis: ['👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '👈', '👉', '👆', '👇', '☝️', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👌', '🤌', '🤏', '🖐️', '✋', '👋'],
  },
  {
    name: 'Hearts & Symbols',
    icon: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔥', '✨', '⭐', '🌟', '💫', '💥', '💯', '⚡', '🎉', '🎊', '🏆', '👑', '💎', '🎯', '🎈'],
  },
  {
    name: 'Objects & Party',
    icon: '🎉',
    emojis: ['🎉', '🚀', '🏆', '💎', '🎯', '🎈', '🎁', '🎮', '📱', '💻', '💡', '💰', '☕', '🍕', '🍔', '🍺', '🚗', '✈️', '🌈', '☀️', '🌙', '⭐', '⚡', '🎵', '🎧', '📸', '🔥', '🪄', '🔔', '⚽'],
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const conversation = dummyConversationData.find((c) => c._id === id) || dummyConversationData[0];
  const participantName = conversation.title || conversation.participant?.name || 'Telejog Chat';
  const participantAvatar = conversation.avatar || conversation.participant?.avatar || 'https://i.pravatar.cc/150';
  const isOnline = conversation.participant?.isOnline || conversation.type === 'bot';
  const statusText = conversation.type === 'channel'
    ? `${conversation.membersCount?.toLocaleString()} subscribers`
    : conversation.type === 'group'
    ? `${conversation.membersCount} members`
    : isOnline
    ? 'online'
    : conversation.participant?.lastSeen || 'last seen recently';

  const [messages, setMessages] = useState<Message[]>(
    dummyMessagesMap[id as string] || dummyMessagesMap['conv_1']
  );
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Single message reply state
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Message menu & reactions state
  const [selectedMsgForMenu, setSelectedMsgForMenu] = useState<Message | null>(null);
  const [showFullEmojiModal, setShowFullEmojiModal] = useState(false);
  const [showInputEmojiTray, setShowInputEmojiTray] = useState(false);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState(0);

  // Monitor keyboard visibility to coordinate keyboard and emoji tray smoothly
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        setShowInputEmojiTray(false);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleToggleEmojiTray = () => {
    if (showInputEmojiTray) {
      setShowInputEmojiTray(false);
      inputRef.current?.focus();
    } else {
      Keyboard.dismiss();
      setShowInputEmojiTray(true);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const handleBackspace = () => {
    setInputText((prev) => {
      if (!prev) return '';
      const chars = Array.from(prev);
      chars.pop();
      return chars.join('');
    });
  };

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const replySenderName = replyingTo
      ? replyingTo.sender === 'current_user'
        ? 'You'
        : participantName
      : '';

    const replySnippet = replyingTo
      ? replyingTo.text ||
        (replyingTo.mediaType === 'image'
          ? '📷 Photo'
          : replyingTo.mediaType === 'voice'
          ? '🎤 Voice note'
          : 'Attachment')
      : '';

    const newMessage: Message = {
      _id: `msg_${Date.now()}`,
      sender: 'current_user',
      conversationId: conversation._id,
      text: inputText.trim(),
      read: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...(replyingTo
        ? {
            replyTo: {
              _id: replyingTo._id,
              text: replySnippet,
              senderName: replySenderName,
            },
          }
        : {}),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setReplyingTo(null);
    setShowInputEmojiTray(false);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Toggle reaction on a message
  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg._id === msgId) {
          const reactions = msg.reactions ? [...msg.reactions] : [];
          const existingIndex = reactions.findIndex((r) => r.emoji === emoji);

          if (existingIndex > -1) {
            const existing = reactions[existingIndex];
            if (existing.userReacted) {
              if (existing.count <= 1) {
                reactions.splice(existingIndex, 1);
              } else {
                reactions[existingIndex] = {
                  ...existing,
                  count: existing.count - 1,
                  userReacted: false,
                };
              }
            } else {
              reactions[existingIndex] = {
                ...existing,
                count: existing.count + 1,
                userReacted: true,
              };
            }
          } else {
            reactions.push({ emoji, count: 1, userReacted: true });
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    );

    setSelectedMsgForMenu(null);
    setShowFullEmojiModal(false);
  };

  const handleStartReply = (msg: Message) => {
    setReplyingTo(msg);
    setSelectedMsgForMenu(null);
    setShowInputEmojiTray(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  const handleScrollToRepliedMessage = (repliedMsgId: string) => {
    const targetIndex = messages.findIndex((m) => m._id === repliedMsgId);
    if (targetIndex !== -1) {
      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0.5,
      });
      setHighlightedMsgId(repliedMsgId);
      setTimeout(() => setHighlightedMsgId(null), 1800);
    } else {
      showToast('Original message not found');
    }
  };

  const handleCopyMessage = (msg: Message) => {
    setSelectedMsgForMenu(null);
    if (typeof navigator !== 'undefined' && navigator.clipboard && msg.text) {
      navigator.clipboard.writeText(msg.text).catch(() => {});
    }
    showToast('Copied to clipboard');
  };

  const handleDeleteMessage = (msgId: string) => {
    setMessages((prev) => prev.filter((m) => m._id !== msgId));
    setSelectedMsgForMenu(null);
    showToast('Message deleted');
  };

  const handlePinMessage = (msg: Message) => {
    setMessages((prev) =>
      prev.map((m) => (m._id === msg._id ? { ...m, pinned: !m.pinned } : m))
    );
    setSelectedMsgForMenu(null);
    showToast(msg.pinned ? 'Unpinned' : 'Pinned to top');
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'current_user';
    const isHighlighted = highlightedMsgId === item._id;

    return (
      <View
        style={[
          styles.msgRow,
          isMe ? styles.msgRowRight : styles.msgRowLeft,
          isHighlighted && styles.msgRowHighlighted,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onLongPress={() => setSelectedMsgForMenu(item)}
          style={[
            styles.bubble,
            isMe ? styles.bubbleRight : styles.bubbleLeft,
            isHighlighted && styles.bubbleHighlighted,
          ]}
        >
          {/* Pinned Badge */}
          {item.pinned && (
            <View style={styles.pinnedBadge}>
              <Ionicons name="pin" size={11} color={Colors.neonMint} />
              <Text style={styles.pinnedText}>Pinned message</Text>
            </View>
          )}

          {/* Reply Reference Box */}
          {item.replyTo && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleScrollToRepliedMessage(item.replyTo!._id)}
              style={styles.replyBox}
            >
              <View style={styles.replyBarAccent} />
              <View style={{ flex: 1 }}>
                <Text style={styles.replySender}>{item.replyTo.senderName}</Text>
                <Text style={styles.replyText} numberOfLines={2}>
                  {item.replyTo.text}
                </Text>
              </View>
              <Ionicons name="arrow-undo" size={13} color={Colors.neonMint} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}

          {/* Photo Attachment */}
          {item.mediaUrl && item.mediaType === 'image' && (
            <TouchableOpacity onPress={() => setSelectedImage(item.mediaUrl!)}>
              <Image source={{ uri: item.mediaUrl }} style={styles.attachmentImg} />
            </TouchableOpacity>
          )}

          {/* Voice Note Attachment with Neon Waveform */}
          {item.mediaType === 'voice' && (
            <View style={styles.voiceContainer}>
              <TouchableOpacity style={styles.playBtn}>
                <Ionicons name="play" size={17} color="#FFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
              <View style={styles.waveformBox}>
                <View style={[styles.waveLine, { height: 10 }]} />
                <View style={[styles.waveLine, { height: 22 }]} />
                <View style={[styles.waveLine, { height: 8 }]} />
                <View style={[styles.waveLine, { height: 26 }]} />
                <View style={[styles.waveLine, { height: 16 }]} />
                <View style={[styles.waveLine, { height: 12 }]} />
                <View style={[styles.waveLine, { height: 20 }]} />
                <View style={[styles.waveLine, { height: 14 }]} />
              </View>
              <Text style={styles.voiceDuration}>{item.voiceDuration || '0:15'}</Text>
            </View>
          )}

          {/* Message Text */}
          {item.text && <Text style={styles.msgText}>{item.text}</Text>}

          {/* Footer Time & Checkmark */}
          <View style={styles.msgFooter}>
            <Text style={styles.msgTime}>{item.createdAt}</Text>
            {isMe && (
              <Ionicons
                name={item.read ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={Colors.neonMint}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>

          {/* Reactions Row */}
          {item.reactions && item.reactions.length > 0 && (
            <View style={styles.reactionsRow}>
              {item.reactions.map((r, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.7}
                  onPress={() => handleToggleReaction(item._id, r.emoji)}
                  style={[
                    styles.reactionBadge,
                    r.userReacted && styles.reactionBadgeActive,
                  ]}
                >
                  <Text style={styles.reactionEmoji}>{r.emoji}</Text>
                  <Text
                    style={[
                      styles.reactionCount,
                      r.userReacted && styles.reactionCountActive,
                    ]}
                  >
                    {r.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Quick inline reply action icon */}
        <TouchableOpacity
          style={styles.quickReplyActionBtn}
          onPress={() => handleStartReply(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="return-up-back" size={16} color="#5E6F85" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Modern Telejog Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerProfile} activeOpacity={0.8}>
            <View style={styles.headerAvatarContainer}>
              <Image source={{ uri: participantAvatar }} style={styles.headerAvatar} />
              {isOnline && <View style={styles.headerOnlineDot} />}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerName} numberOfLines={1}>
                {participantName}
              </Text>
              <Text style={[styles.headerStatus, isOnline && styles.headerStatusOnline]}>
                {statusText}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="call-outline" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="videocam-outline" size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="ellipsis-vertical" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Background & Message List */}
        <View style={styles.chatBackground}>
          {/* Telejog Date Chip */}
          <View style={styles.dateChipContainer}>
            <View style={styles.dateChip}>
              <Text style={styles.dateChipText}>Today</Text>
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.messagesList}
            onScrollToIndexFailed={() => {}}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Toast Notification */}
        {toastMessage && (
          <View style={styles.toastContainer}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* TELEJOG FLOATING BOTTOM INPUT DOCK */}
        <View
          style={[
            styles.floatingContainer,
            {
              paddingBottom: isKeyboardVisible
                ? 8
                : showInputEmojiTray
                ? 0
                : Math.max(insets.bottom, 12),
            },
          ]}
        >
          {/* FLOATING ACTION ROW */}
          <View style={styles.floatingActionRow}>
            {/* FLOATING PILL DOCK (WITH INTEGRATED REPLY PREVIEW) */}
            <View style={styles.floatingInputDock}>
              {/* SINGLE MESSAGE REPLY PREVIEW BANNER */}
              {replyingTo && (
                <View style={styles.floatingReplyPreviewBar}>
                  <View style={styles.floatingReplyAccentLine} />
                  <Ionicons name="arrow-undo" size={17} color={Colors.neonMint} style={{ marginHorizontal: 8 }} />
                  <View style={styles.floatingReplyContent}>
                    <Text style={styles.floatingReplySender} numberOfLines={1}>
                      Replying to {replyingTo.sender === 'current_user' ? 'You' : participantName}
                    </Text>
                    <Text style={styles.floatingReplyText} numberOfLines={2}>
                      {replyingTo.text ||
                        (replyingTo.mediaType === 'image'
                          ? '📷 Photo'
                          : replyingTo.mediaType === 'voice'
                          ? '🎤 Voice note'
                          : 'Message')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.floatingCancelReplyBtn}
                    onPress={() => setReplyingTo(null)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={20} color="#8B9BB0" />
                  </TouchableOpacity>
                </View>
              )}

              {/* INPUT CONTROLS ROW */}
              <View style={styles.floatingInputControlsRow}>
                <TouchableOpacity style={styles.floatingAttachmentBtn} activeOpacity={0.7}>
                  <Ionicons name="attach-outline" size={24} color="#8B9BB0" />
                </TouchableOpacity>

                <TextInput
                  ref={inputRef}
                  placeholder={replyingTo ? 'Write a reply...' : 'Message...'}
                  placeholderTextColor="#6D7E94"
                  style={[
                    styles.floatingTextInput,
                    Platform.OS === 'web' && ({
                      outlineStyle: 'none',
                      outlineWidth: 0,
                      outlineColor: 'transparent',
                      boxShadow: 'none',
                    } as any),
                  ]}
                  value={inputText}
                  onChangeText={setInputText}
                  onFocus={() => {
                    setShowInputEmojiTray(false);
                    setTimeout(() => {
                      flatListRef.current?.scrollToEnd({ animated: true });
                    }, 150);
                  }}
                  multiline
                />

                <TouchableOpacity
                  style={styles.floatingEmojiBtn}
                  onPress={handleToggleEmojiTray}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showInputEmojiTray ? 'keypad-outline' : 'happy-outline'}
                    size={24}
                    color={showInputEmojiTray ? Colors.primary : '#8B9BB0'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* FLOATING CIRCULAR SEND / MIC BUTTON */}
            {inputText.trim().length > 0 ? (
              <TouchableOpacity
                style={styles.floatingSendBtn}
                onPress={handleSendMessage}
                activeOpacity={0.85}
              >
                <Ionicons name="send" size={19} color="#FFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.floatingMicBtn}
                activeOpacity={0.85}
              >
                <Ionicons name="mic-outline" size={22} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>

          {/* IN-APP TELEJOG EMOJI TRAY */}
          {showInputEmojiTray && (
            <View
              style={[
                styles.inputEmojiTray,
                { paddingBottom: Math.max(insets.bottom, 12) },
              ]}
            >
              {/* Category tabs & backspace header */}
              <View style={styles.emojiTrayHeader}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScrollContent}
                >
                  {EMOJI_CATEGORIES.map((cat, idx) => (
                    <TouchableOpacity
                      key={cat.name}
                      style={[
                        styles.emojiCategoryTab,
                        selectedEmojiCategory === idx && styles.emojiCategoryTabActive,
                      ]}
                      onPress={() => setSelectedEmojiCategory(idx)}
                    >
                      <Text style={styles.emojiCategoryIcon}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.emojiCategoryLabel,
                          selectedEmojiCategory === idx && styles.emojiCategoryLabelActive,
                        ]}
                      >
                        {cat.name.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.emojiBackspaceBtn}
                  onPress={handleBackspace}
                  activeOpacity={0.7}
                >
                  <Ionicons name="backspace-outline" size={22} color="#8B9BB0" />
                </TouchableOpacity>
              </View>

              {/* Multi-row scrollable Emoji Grid */}
              <ScrollView
                style={styles.emojiGridScroll}
                contentContainerStyle={styles.emojiGridContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
              >
                {EMOJI_CATEGORIES[selectedEmojiCategory].emojis.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={styles.trayEmojiItem}
                    activeOpacity={0.6}
                    onPress={() => handleSelectEmoji(emoji)}
                  >
                    <Text style={styles.trayEmojiChar}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* MESSAGE ACTIONS & QUICK REACTION MODAL */}
        {selectedMsgForMenu && (
          <Modal visible transparent animationType="fade" onRequestClose={() => setSelectedMsgForMenu(null)}>
            <TouchableOpacity
              style={styles.menuOverlay}
              activeOpacity={1}
              onPress={() => setSelectedMsgForMenu(null)}
            >
              <View style={styles.menuContainer}>
                {/* 1. EMOJI REACTION QUICK PICKER BAR */}
                <View style={styles.menuReactionPill}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {QUICK_EMOJIS.map((emoji) => {
                      const hasReacted = selectedMsgForMenu.reactions?.some(
                        (r) => r.emoji === emoji && r.userReacted
                      );
                      return (
                        <TouchableOpacity
                          key={emoji}
                          style={[
                            styles.quickReactionBtn,
                            hasReacted && styles.quickReactionBtnActive,
                          ]}
                          onPress={() => handleToggleReaction(selectedMsgForMenu._id, emoji)}
                        >
                          <Text style={{ fontSize: 24 }}>{emoji}</Text>
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity
                      style={styles.allEmojisBtn}
                      onPress={() => setShowFullEmojiModal(true)}
                    >
                      <Ionicons name="add" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </ScrollView>
                </View>

                {/* 2. TELEJOG MESSAGE ACTIONS MENU */}
                <View style={styles.menuActionsCard}>
                  <TouchableOpacity
                    style={styles.menuActionRow}
                    onPress={() => handleStartReply(selectedMsgForMenu)}
                  >
                    <Ionicons name="arrow-undo-outline" size={20} color={Colors.neonMint} />
                    <Text style={styles.menuActionText}>Reply</Text>
                  </TouchableOpacity>

                  <View style={styles.menuDivider} />

                  {selectedMsgForMenu.text && (
                    <>
                      <TouchableOpacity
                        style={styles.menuActionRow}
                        onPress={() => handleCopyMessage(selectedMsgForMenu)}
                      >
                        <Ionicons name="copy-outline" size={20} color="#FFF" />
                        <Text style={styles.menuActionText}>Copy Text</Text>
                      </TouchableOpacity>
                      <View style={styles.menuDivider} />
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.menuActionRow}
                    onPress={() => handlePinMessage(selectedMsgForMenu)}
                  >
                    <Ionicons
                      name={selectedMsgForMenu.pinned ? 'pin' : 'pin-outline'}
                      size={20}
                      color="#FFF"
                    />
                    <Text style={styles.menuActionText}>
                      {selectedMsgForMenu.pinned ? 'Unpin' : 'Pin Message'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.menuDivider} />

                  <TouchableOpacity
                    style={styles.menuActionRow}
                    onPress={() => {
                      setSelectedMsgForMenu(null);
                      showToast('Forwarding message...');
                    }}
                  >
                    <Ionicons name="arrow-redo-outline" size={20} color="#FFF" />
                    <Text style={styles.menuActionText}>Forward</Text>
                  </TouchableOpacity>

                  <View style={styles.menuDivider} />

                  <TouchableOpacity
                    style={styles.menuActionRow}
                    onPress={() => handleDeleteMessage(selectedMsgForMenu._id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF4757" />
                    <Text style={[styles.menuActionText, { color: '#FF4757' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        {/* FULL EMOJI REACTION PICKER MODAL */}
        {showFullEmojiModal && selectedMsgForMenu && (
          <Modal
            visible={showFullEmojiModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowFullEmojiModal(false)}
          >
            <View style={styles.fullEmojiOverlay}>
              <View style={styles.fullEmojiSheet}>
                <View style={styles.fullEmojiHeader}>
                  <Text style={styles.fullEmojiTitle}>Choose Reaction</Text>
                  <TouchableOpacity
                    style={styles.closeFullEmojiBtn}
                    onPress={() => setShowFullEmojiModal(false)}
                  >
                    <Ionicons name="close" size={22} color="#FFF" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.fullEmojiScroll} showsVerticalScrollIndicator={false}>
                  {EMOJI_CATEGORIES.map((category) => (
                    <View key={category.name} style={styles.categorySection}>
                      <Text style={styles.categoryHeaderTitle}>{category.name}</Text>
                      <View style={styles.emojiGrid}>
                        {category.emojis.map((emoji) => (
                          <TouchableOpacity
                            key={emoji}
                            style={styles.gridEmojiBtn}
                            onPress={() => handleToggleReaction(selectedMsgForMenu._id, emoji)}
                          >
                            <Text style={{ fontSize: 26 }}>{emoji}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                  <View style={{ height: 30 }} />
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}

        {/* Full Image Viewer Modal */}
        {selectedImage && (
          <Modal visible animationType="fade" transparent>
            <View style={styles.imageViewerOverlay}>
              <TouchableOpacity
                style={styles.closeImageBtn}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close" size={28} color="#FFF" />
              </TouchableOpacity>
              <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    height: 58,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: {
    padding: 6,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerAvatarContainer: {
    position: 'relative',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceCard,
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.online,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  headerInfo: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  headerName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerStatus: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  headerStatusOnline: {
    color: Colors.online,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  chatBackground: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dateChipContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateChip: {
    backgroundColor: 'rgba(22, 25, 43, 0.88)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  dateChipText: {
    color: Colors.textSecondary,
    fontSize: 11.5,
    fontWeight: '600',
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  msgRow: {
    marginVertical: 4,
    maxWidth: '82%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  msgRowRight: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  msgRowLeft: {
    alignSelf: 'flex-start',
    flexDirection: 'row-reverse',
  },
  msgRowHighlighted: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 14,
    padding: 2,
  },
  quickReplyActionBtn: {
    padding: 6,
    opacity: 0.5,
  },
  bubble: {
    borderRadius: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
    maxWidth: '100%',
  },
  bubbleRight: {
    backgroundColor: Colors.sentBubble,
    borderBottomRightRadius: 3,
    borderWidth: 1,
    borderColor: Colors.sentBubbleBorder,
  },
  bubbleLeft: {
    backgroundColor: Colors.receivedBubble,
    borderBottomLeftRadius: 3,
    borderWidth: 1,
    borderColor: Colors.receivedBubbleBorder,
  },
  bubbleHighlighted: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pinnedText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  msgText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 21,
  },
  attachmentImg: {
    width: 230,
    height: 160,
    borderRadius: 10,
    marginBottom: 6,
  },
  replyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.16)',
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 3.5,
    borderLeftColor: Colors.primary,
  },
  replyBarAccent: {
    width: 0,
  },
  replySender: {
    color: Colors.primary,
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  replyText: {
    color: '#E0E7F0',
    fontSize: 12.5,
    lineHeight: 16,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 190,
    marginVertical: 4,
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryViolet,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryViolet,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  waveformBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 8,
  },
  waveLine: {
    width: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  voiceDuration: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  msgFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  msgTime: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  reactionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reactionBadgeActive: {
    backgroundColor: 'rgba(0, 245, 212, 0.16)',
    borderColor: Colors.primary,
  },
  reactionEmoji: {
    fontSize: 13,
  },
  reactionCount: {
    color: '#FFF',
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '600',
  },
  reactionCountActive: {
    color: Colors.primary,
  },
  toastContainer: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    backgroundColor: Colors.surfaceCard,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    zIndex: 999,
  },
  toastText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  replyPreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  floatingContainer: {
    backgroundColor: 'transparent',
  },
  floatingActionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 4,
  },
  floatingInputDock: {
    flex: 1,
    backgroundColor: Colors.surfaceCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  floatingReplyPreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  floatingReplyAccentLine: {
    width: 3.5,
    height: 30,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  floatingReplyContent: {
    flex: 1,
    marginLeft: 6,
  },
  floatingReplySender: {
    color: Colors.primary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  floatingReplyText: {
    color: '#CFD8E3',
    fontSize: 12,
    marginTop: 1,
  },
  floatingCancelReplyBtn: {
    padding: 4,
    marginLeft: 6,
  },
  floatingInputControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    minHeight: 48,
  },
  floatingAttachmentBtn: {
    padding: 8,
  },
  floatingTextInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    maxHeight: 110,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  floatingEmojiBtn: {
    padding: 8,
  },
  floatingSendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryViolet,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: Colors.primaryViolet,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingMicBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryViolet,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: Colors.primaryViolet,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  inputEmojiTray: {
    height: 260,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  emojiTrayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  categoryScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiCategoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  emojiCategoryTabActive: {
    backgroundColor: 'rgba(0, 245, 212, 0.16)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  emojiCategoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  emojiCategoryLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  emojiCategoryLabelActive: {
    color: Colors.primary,
  },
  emojiBackspaceBtn: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginLeft: 6,
  },
  emojiGridScroll: {
    flex: 1,
  },
  emojiGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 6,
    paddingVertical: 8,
    justifyContent: 'flex-start',
  },
  trayEmojiItem: {
    width: '12.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trayEmojiChar: {
    fontSize: 27,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuContainer: {
    width: '85%',
    maxWidth: 320,
  },
  menuReactionPill: {
    flexDirection: 'row',
    backgroundColor: '#172133',
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickReactionBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 16,
  },
  quickReactionBtnActive: {
    backgroundColor: 'rgba(0, 168, 255, 0.25)',
  },
  allEmojisBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#141C2B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  menuActionsCard: {
    backgroundColor: '#172133',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  menuActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  menuActionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 14,
  },
  menuDivider: {
    height: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginLeft: 52,
  },
  fullEmojiOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  fullEmojiSheet: {
    backgroundColor: '#141C2B',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '65%',
    paddingTop: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  fullEmojiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  fullEmojiTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  closeFullEmojiBtn: {
    padding: 4,
  },
  fullEmojiScroll: {
    paddingTop: 10,
  },
  categorySection: {
    marginVertical: 8,
  },
  categoryHeaderTitle: {
    color: '#8B9BB0',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridEmojiBtn: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
});