import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, StatusBar, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyConversationData, dummyStoriesData } from '@/assets/assets';
import { Conversation, UserStory } from '@/types';
import StoriesBar from '@/components/StoriesBar';
import TelegramDrawer from '@/components/TelegramDrawer';
import CategoryFolderTabs, { ChatCategory } from '@/components/CategoryFolderTabs';

export default function MessageScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ChatCategory>('all');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setConversations(dummyConversationData as any);
    setStories(dummyStoriesData as any);
  }, []);

  // Filter conversations
  const filteredConversations = conversations.filter((item) => {
    // Search filter
    const title = item.title || item.participant?.name || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    // Category filter
    if (activeCategory === 'all') return true;
    if (activeCategory === 'channels') return item.type === 'channel';
    if (activeCategory === 'groups') return item.type === 'group';
    if (activeCategory === 'bots') return item.type === 'bot';
    if (activeCategory === 'personal') return item.type === 'user' || !item.type;

    return true;
  });

  const unreadCounts: Record<ChatCategory, number> = {
    all: conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    channels: conversations.filter(c => c.type === 'channel').reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    groups: conversations.filter(c => c.type === 'group').reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    bots: conversations.filter(c => c.type === 'bot').reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    personal: conversations.filter(c => c.type === 'user' || !c.type).reduce((acc, c) => acc + (c.unreadCount || 0), 0),
  };

  const themeBg = isDarkMode ? '#0E1621' : '#F0F2F5';
  const headerBg = isDarkMode ? '#17212B' : '#517DA2';
  const cardBg = isDarkMode ? '#17212B' : '#FFFFFF';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#000000';
  const textSecondary = isDarkMode ? '#7F91A4' : '#707579';

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const isChannel = item.type === 'channel';
    const isGroup = item.type === 'group';
    const isBot = item.type === 'bot';

    const avatarUri = item.avatar || item.participant?.avatar || 'https://i.pravatar.cc/150';
    const title = item.title || item.participant?.name || 'User';

    return (
      <TouchableOpacity
        style={[styles.chatRow, { backgroundColor: cardBg }]}
        activeOpacity={0.7}
        onPress={() => router.push(`/chat/${item._id}` as any)}
      >
        {/* Avatar Container */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          {item.participant?.isOnline && (
            <View style={styles.onlineDot} />
          )}
          {isBot && (
            <View style={styles.botBadge}>
              <Text style={styles.botBadgeText}>BOT</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.chatDetails}>
          <View style={styles.chatHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Text style={[styles.chatTitle, { color: textPrimary }]} numberOfLines={1}>
                {title}
              </Text>
              {item.participant?.verified && (
                <Ionicons name="checkmark-circle" size={15} color="#2AABEE" style={{ marginLeft: 4 }} />
              )}
            </View>
            <Text style={[styles.timeText, { color: textSecondary }]}>
              {item.lastMessage?.createdAt ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
          </View>

          <View style={styles.chatSubRow}>
            <View style={styles.messagePreviewContainer}>
              {item.lastMessage?.sender === 'current_user' && (
                <Ionicons
                  name={item.lastMessage.read ? "checkmark-done" : "checkmark"}
                  size={16}
                  color="#2AABEE"
                  style={{ marginRight: 4 }}
                />
              )}
              <Text style={[styles.lastMessageText, { color: textSecondary }]} numberOfLines={1}>
                {item.lastMessage?.text || 'No messages yet'}
              </Text>
            </View>

            <View style={styles.statusIconsContainer}>
              {item.isMuted && (
                <Ionicons name="notifications-off-outline" size={14} color={textSecondary} style={{ marginRight: 4 }} />
              )}
              {item.isPinned && (
                <Ionicons name="pin" size={14} color="#2AABEE" style={{ marginRight: 4 }} />
              )}
              {(item.unreadCount || 0) > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: item.isMuted ? '#4E5D6E' : '#2AABEE' }]}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: headerBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={headerBg} />

      {/* Telegram App Header */}
      <View style={[styles.topHeader, { backgroundColor: headerBg }]}>
        {isSearchOpen ? (
          <View style={styles.searchBarHeader}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" />
            <TextInput
              placeholder="Search Telejog..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.headerSearchInput}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            <TouchableOpacity onPress={() => { setIsSearchOpen(false); setSearch(''); }}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.iconBtn}>
              <Ionicons name="menu" size={26} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Telejog</Text>
            </View>

            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={() => setIsSearchOpen(true)} style={styles.iconBtn}>
                <Ionicons name="search" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.iconBtn}>
                <Ionicons name={isDarkMode ? "sunny" : "moon"} size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Top Telegram Folder Category Tabs */}
      <CategoryFolderTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        isDarkMode={isDarkMode}
        unreadCounts={unreadCounts}
      />

      {/* Main Content Area */}
      <View style={[styles.body, { backgroundColor: themeBg }]}>
        {/* Telegram Stories Bar */}
        <StoriesBar stories={stories} />

        {/* Conversations List */}
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item._id}
          renderItem={renderConversationItem}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: isDarkMode ? '#101721' : '#E6E8EA' }]} />
          )}
        />
      </View>

      {/* Telegram Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fabBtn} activeOpacity={0.85}>
        <MaterialCommunityIcons name="pencil" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Telegram Slide Drawer */}
      <TelegramDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 18,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 6,
    marginLeft: 10,
  },
  searchBarHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSearchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
  },
  body: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 80,
  },
  chatRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#40A7E3',
    borderWidth: 2,
    borderColor: '#17212B',
  },
  botBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2AABEE',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  botBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  chatDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
  },
  chatSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  lastMessageText: {
    fontSize: 14,
    flex: 1,
  },
  statusIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  separator: {
    height: 0.5,
    marginLeft: 84,
  },
  fabBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2AABEE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});