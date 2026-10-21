import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyConversationData, dummyStoriesData } from '@/assets/assets';
import { Conversation, UserStory } from '@/types';
import StoriesBar from '@/components/StoriesBar';
import TelejogDrawer from '@/components/TelejogDrawer';
import TelejogLogo from '@/components/TelejogLogo';
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
    const title = item.title || item.participant?.name || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'channels') return item.type === 'channel';
    if (activeCategory === 'groups') return item.type === 'group';
    if (activeCategory === 'bots') return item.type === 'bot';
    if (activeCategory === 'personal') return item.type === 'user' || !item.type;

    return true;
  });

  const unreadCounts: Record<ChatCategory, number> = {
    all: conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    channels: conversations.filter((c) => c.type === 'channel').reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    groups: conversations.filter((c) => c.type === 'group').reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    bots: conversations.filter((c) => c.type === 'bot').reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    personal: conversations.filter((c) => c.type === 'user' || !c.type).reduce((acc, c) => acc + (c.unreadCount || 0), 0),
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const isChannel = item.type === 'channel';
    const isGroup = item.type === 'group';
    const isBot = item.type === 'bot';

    const avatarUri = item.avatar || item.participant?.avatar || 'https://i.pravatar.cc/150';
    const title = item.title || item.participant?.name || 'User';

    return (
      <TouchableOpacity
        style={styles.chatRow}
        activeOpacity={0.72}
        onPress={() => router.push(`/chat/${item._id}` as any)}
      >
        {/* Avatar Container with Online Indicator */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          {item.participant?.isOnline && <View style={styles.onlineDot} />}
          {isBot && (
            <View style={styles.botBadge}>
              <Text style={styles.botBadgeText}>BOT</Text>
            </View>
          )}
          {isChannel && (
            <View style={styles.channelBadge}>
              <Ionicons name="megaphone" size={10} color="#FFF" />
            </View>
          )}
        </View>

        {/* Chat Details */}
        <View style={styles.chatDetails}>
          <View style={styles.chatHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Text style={styles.chatTitle} numberOfLines={1}>
                {title}
              </Text>
              {item.participant?.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={15}
                  color={Colors.primary}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <Text style={styles.timeText}>
              {item.lastMessage?.createdAt
                ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          </View>

          <View style={styles.chatSubRow}>
            <View style={styles.messagePreviewContainer}>
              {item.lastMessage?.sender === 'current_user' && (
                <Ionicons
                  name={item.lastMessage.read ? 'checkmark-done' : 'checkmark'}
                  size={15}
                  color={Colors.primary}
                  style={{ marginRight: 4 }}
                />
              )}
              <Text style={styles.lastMessageText} numberOfLines={1}>
                {item.lastMessage?.text || 'No messages yet'}
              </Text>
            </View>

            <View style={styles.statusIconsContainer}>
              {item.isMuted && (
                <Ionicons
                  name="notifications-off-outline"
                  size={14}
                  color={Colors.textMuted}
                  style={{ marginRight: 6 }}
                />
              )}
              {item.isPinned && (
                <View style={styles.pinnedIconBox}>
                  <Ionicons name="pin" size={13} color={Colors.primaryViolet} />
                </View>
              )}
              {(item.unreadCount || 0) > 0 && (
                <View
                  style={[
                    styles.unreadBadge,
                    item.isMuted && styles.unreadBadgeMuted,
                  ]}
                >
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F17" />

      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        {isSearchOpen ? (
          <View style={styles.searchBarHeader}>
            <Ionicons name="search" size={20} color={Colors.primary} />
            <TextInput
              placeholder="Search chats, people, channels..."
              placeholderTextColor={Colors.textMuted}
              style={[
                styles.headerSearchInput,
                Platform.OS === 'web' && ({
                  outlineStyle: 'none',
                  outlineWidth: 0,
                  outlineColor: 'transparent',
                  boxShadow: 'none',
                } as any),
              ]}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setIsSearchOpen(false);
                setSearch('');
              }}
              style={styles.closeSearchBtn}
            >
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setDrawerVisible(true)}
              style={styles.drawerBtn}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <View style={styles.menuBarLong} />
                <View style={styles.menuBarMedium} />
                <View style={styles.menuBarShort} />
              </View>
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <View style={styles.brandBadge}>
                <TelejogLogo size={24} glow={false} />
                <Text style={[styles.headerTitle, { marginLeft: 8 }]}>Telejog</Text>
              </View>
            </View>

            <View style={styles.headerRightActions}>
              <TouchableOpacity
                onPress={() => setIsSearchOpen(true)}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="search-outline" size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/devices')}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="laptop-outline" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Category Tabs */}
      <CategoryFolderTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        isDarkMode={isDarkMode}
        unreadCounts={unreadCounts}
      />

      {/* Main Content */}
      <View style={styles.body}>
        {/* Stories Bar */}
        <StoriesBar stories={stories} />

        {/* Conversations List */}
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item._id}
          renderItem={renderConversationItem}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Glowing FAB (Compose / New Message) */}
      <TouchableOpacity
        style={styles.fabBtn}
        activeOpacity={0.85}
        onPress={() => router.push('/search')}
      >
        <Ionicons name="create-outline" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Slide Drawer */}
      <TelejogDrawer
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
    backgroundColor: Colors.background,
  },
  topHeader: {
    height: 58,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  drawerBtn: {
    padding: 6,
  },
  menuIconContainer: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuBarLong: {
    width: 22,
    height: 2.2,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  menuBarMedium: {
    width: 16,
    height: 2.2,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  menuBarShort: {
    width: 20,
    height: 2.2,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 14,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchBarHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 212, 0.35)',
  },
  headerSearchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 0,
  },
  closeSearchBtn: {
    padding: 4,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    paddingBottom: 80,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surface,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.online,
    borderWidth: 2.5,
    borderColor: Colors.background,
    shadowColor: Colors.online,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  botBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EC4899',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  botBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  channelBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primaryViolet,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  chatDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTitle: {
    color: Colors.textPrimary,
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  timeText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  chatSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreviewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  lastMessageText: {
    color: Colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 18,
  },
  statusIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinnedIconBox: {
    marginRight: 6,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  unreadBadgeMuted: {
    backgroundColor: '#252B44',
    shadowOpacity: 0,
  },
  unreadText: {
    color: Colors.unreadBadgeText,
    fontSize: 11,
    fontWeight: '900',
  },
  separator: {
    height: 0.8,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    marginLeft: 82,
  },
  fabBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryViolet,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryViolet,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});