import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
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
    name: 'Popular Reactions',
    emojis: ['👍', '👎', '❤️', '🔥', '🥰', '👏', '😁', '🤔', '🤯', '😱', '🤬', '😢', '🎉', '🤩', '🤮', '💩', '🙏', '👌', '💯', '⚡', '🤣', '😍', '🚀', '🏆', '💔', '😴', '😭', '🤝'],
  },
  {
    name: 'Smileys & Emotion',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😛', '😜', '🤪', '😝', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😏', '🙄', '😬', '😌', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '🥴', '😵', '🤯', '🥳', '😎', '🤓', '🧐', '🥺', '😱', '😢', '😭', '😤', '😡', '🤬'],
  },
  {
    name: 'Hands & Gestures',
    emojis: ['👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '👈', '👉', '👆', '👇', '☝️', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👌', '🤌', '🤏', '🖐️', '✋', '👋'],
  },
  {
    name: 'Hearts & Symbols',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔥', '✨', '⭐', '🌟', '💫', '💥', '💯', '⚡', '🎉', '🎊', '🏆', '👑', '💎', '🎯', '🎈'],
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
              <Ionicons name="pin" size={11} color="#00A8FF" />
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
                <Text style={styles.replyText} numberOfLines={1}>
                  {item.replyTo.text}
                </Text>
              </View>
              <Ionicons name="arrow-undo" size={12} color="#00A8FF" style={{ marginLeft: 4 }} />
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
                color="#00A8FF"
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Modern Telegram Chat Header */}
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
          {/* Telegram Date Chip */}
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

        {/* SINGLE MESSAGE REPLY PREVIEW BANNER */}
        {replyingTo && (
          <View style={styles.replyPreviewBar}>
            <View style={styles.replyPreviewLine} />
            <Ionicons name="arrow-undo" size={18} color="#00A8FF" style={{ marginHorizontal: 8 }} />
            <View style={styles.replyPreviewContent}>
              <Text style={styles.replyPreviewSender} numberOfLines={1}>
                Reply to {replyingTo.sender === 'current_user' ? 'You' : participantName}
              </Text>
              <Text style={styles.replyPreviewText} numberOfLines={1}>
                {replyingTo.text ||
                  (replyingTo.mediaType === 'image'
                    ? '📷 Photo'
                    : replyingTo.mediaType === 'voice'
                    ? '🎤 Voice note'
                    : 'Message')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.cancelReplyBtn}
              onPress={() => setReplyingTo(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color="#8B9BB0" />
            </TouchableOpacity>
          </View>
        )}

        {/* Telegram Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachmentBtn}>
            <Ionicons name="attach-outline" size={24} color="#8B9BB0" />
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            placeholder={replyingTo ? 'Write a reply...' : 'Message...'}
            placeholderTextColor="#5E6F85"
            style={[
              styles.textInput,
              Platform.OS === 'web' && ({
                outlineStyle: 'none',
                outlineWidth: 0,
                outlineColor: 'transparent',
                boxShadow: 'none',
              } as any),
            ]}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity
            style={styles.emojiBtn}
            onPress={() => setShowInputEmojiTray((prev) => !prev)}
          >
            <Ionicons
              name={showInputEmojiTray ? 'keypad-outline' : 'happy-outline'}
              size={24}
              color={showInputEmojiTray ? '#00A8FF' : '#8B9BB0'}
            />
          </TouchableOpacity>

          {inputText.trim().length > 0 ? (
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Ionicons name="send" size={17} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micBtn}>
              <Ionicons name="mic-outline" size={21} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* IN-APP EMOJI TRAY */}
        {showInputEmojiTray && (
          <View style={styles.inputEmojiTray}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiTrayScroll}>
              {['😀', '😂', '🔥', '❤️', '👍', '🎉', '🥰', '👏', '🙏', '😎', '🤩', '🚀', '💯', '✨', '☕', '🥳', '🙌', '😍', '🤔', '💪', '⚡', '👀', '🤝', '👌'].map(
                (emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={styles.trayEmojiItem}
                    onPress={() => setInputText((prev) => prev + emoji)}
                  >
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>
        )}

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
                      <Ionicons name="add" size={20} color="#00A8FF" />
                    </TouchableOpacity>
                  </ScrollView>
                </View>

                {/* 2. TELEGRAM MESSAGE ACTIONS MENU */}
                <View style={styles.menuActionsCard}>
                  <TouchableOpacity
                    style={styles.menuActionRow}
                    onPress={() => handleStartReply(selectedMsgForMenu)}
                  >
                    <Ionicons name="arrow-undo-outline" size={20} color="#00A8FF" />
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
    backgroundColor: '#0E1420',
  },
  header: {
    height: 58,
    backgroundColor: '#0E1420',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
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
    backgroundColor: '#172133',
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00E676',
    borderWidth: 2,
    borderColor: '#0E1420',
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
    color: '#8B9BB0',
    fontSize: 12,
    marginTop: 1,
  },
  headerStatusOnline: {
    color: '#00E676',
    fontWeight: '500',
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
    backgroundColor: '#0B0F17',
  },
  dateChipContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateChip: {
    backgroundColor: 'rgba(23, 33, 51, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  dateChipText: {
    color: '#8B9BB0',
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
    backgroundColor: 'rgba(0, 168, 255, 0.14)',
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
    backgroundColor: '#174A7A',
    borderBottomRightRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 255, 0.25)',
  },
  bubbleLeft: {
    backgroundColor: '#141C2B',
    borderBottomLeftRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  bubbleHighlighted: {
    borderWidth: 1.5,
    borderColor: '#00A8FF',
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pinnedText: {
    color: '#00A8FF',
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
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#00A8FF',
  },
  replyBarAccent: {
    width: 0,
  },
  replySender: {
    color: '#00A8FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  replyText: {
    color: '#D2D8DF',
    fontSize: 12,
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
    backgroundColor: '#00A8FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
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
    backgroundColor: '#00C6FF',
    borderRadius: 2,
  },
  voiceDuration: {
    color: '#8B9BB0',
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
    color: '#8B9BB0',
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
    backgroundColor: 'rgba(0, 168, 255, 0.22)',
    borderColor: '#00A8FF',
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
    color: '#00A8FF',
  },
  toastContainer: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    backgroundColor: 'rgba(20, 28, 43, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00A8FF',
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
    backgroundColor: '#141C2B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  replyPreviewLine: {
    width: 3,
    height: 32,
    backgroundColor: '#00A8FF',
    borderRadius: 2,
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewSender: {
    color: '#00A8FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  replyPreviewText: {
    color: '#BAC2CB',
    fontSize: 12,
  },
  cancelReplyBtn: {
    padding: 6,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E1420',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  attachmentBtn: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    maxHeight: 100,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  emojiBtn: {
    padding: 6,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#00A8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 3,
  },
  micBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#00A8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 3,
  },
  inputEmojiTray: {
    backgroundColor: '#141C2B',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  emojiTrayScroll: {
    flexDirection: 'row',
  },
  trayEmojiItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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