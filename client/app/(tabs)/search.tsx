import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyConversationData, dummyUsers } from '@/assets/assets';
import { useRouter } from 'expo-router';

// Rich Mock Data for Media Tab
const DUMMY_MEDIA_ITEMS = [
  {
    id: 'media_1',
    url: 'https://picsum.photos/id/1015/600/400',
    title: 'Mountain Retreat 🏔️',
    sender: 'Ethan Parker',
    date: 'Oct 8',
    chatId: 'conv_1',
    type: 'image',
  },
  {
    id: 'media_2',
    url: 'https://picsum.photos/id/1011/600/400',
    title: 'Coffee & Code ☕',
    sender: 'Olivia Bennett',
    date: 'Oct 7',
    chatId: 'conv_2',
    type: 'image',
  },
  {
    id: 'media_3',
    url: 'https://picsum.photos/id/1025/600/400',
    title: 'Sunset Horizon 🌅',
    sender: 'Liam Carter',
    date: 'Oct 6',
    chatId: 'conv_3',
    type: 'image',
  },
  {
    id: 'media_4',
    url: 'https://picsum.photos/id/1043/600/400',
    title: 'New Audio Setup 🎧',
    sender: 'Sophia Reed',
    date: 'Oct 5',
    chatId: 'conv_4',
    type: 'image',
  },
  {
    id: 'media_5',
    url: 'https://picsum.photos/id/1050/600/400',
    title: 'Design Workshop 🎨',
    sender: 'Telejog Developers',
    date: 'Oct 4',
    chatId: 'conv_group_1',
    type: 'image',
  },
  {
    id: 'media_6',
    url: 'https://picsum.photos/id/1062/600/400',
    title: 'Server Cluster 🚀',
    sender: 'Noah Mitchell',
    date: 'Oct 2',
    chatId: 'conv_5',
    type: 'image',
  },
];

// Rich Mock Data for Links Tab
const DUMMY_LINKS_ITEMS = [
  {
    id: 'link_1',
    title: 'Telejog Protocol v3.0 Documentation',
    domain: 'telejog.org',
    url: 'https://telejog.org/docs/v3',
    snippet: 'Complete API reference and architecture guides for Telejog high-speed client.',
    date: 'Oct 8',
    sender: 'Telejog Admin',
    chatId: 'conv_pinned_1',
  },
  {
    id: 'link_2',
    title: 'React Native Web 0.21 Release Notes',
    domain: 'github.com',
    url: 'https://github.com/telejog/client',
    snippet: 'Performance optimizations, modern CSS grid and flexbox improvements.',
    date: 'Oct 8',
    sender: 'Alex Dev',
    chatId: 'conv_group_1',
  },
  {
    id: 'link_3',
    title: 'Cyber Obsidian Design System',
    domain: 'figma.com',
    url: 'https://figma.com/@telejog/cyber-obsidian',
    snippet: 'Full token kit, components, neon glow effects and dark luxury UI patterns.',
    date: 'Oct 7',
    sender: 'Ethan Parker',
    chatId: 'conv_1',
  },
  {
    id: 'link_4',
    title: 'Expo SDK 57 Cross-Platform Updates',
    domain: 'expo.dev',
    url: 'https://expo.dev/changelog',
    snippet: 'Latest compiler speeds, WebAssembly audio streaming and memory management.',
    date: 'Oct 5',
    sender: 'Liam Carter',
    chatId: 'conv_3',
  },
];

// Rich Mock Data for Files Tab
const DUMMY_FILES_ITEMS = [
  {
    id: 'file_1',
    title: 'Telejog_Design_Specs_v3.pdf',
    size: '14.8 MB',
    date: 'Oct 8',
    sender: 'Ethan Parker',
    extension: 'PDF',
    chatId: 'conv_1',
  },
  {
    id: 'file_2',
    title: 'Client_Web_Build_Assets.zip',
    size: '48.2 MB',
    date: 'Oct 8',
    sender: 'Alex Dev',
    extension: 'ZIP',
    chatId: 'conv_group_1',
  },
  {
    id: 'file_3',
    title: 'Telejog_Android_Beta.apk',
    size: '32.1 MB',
    date: 'Oct 6',
    sender: 'Telejog Admin',
    extension: 'APK',
    chatId: 'conv_pinned_1',
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Chats' | 'Channels' | 'Bots' | 'Media' | 'Links' | 'Files'>('All');
  const [isFocused, setIsFocused] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Telejog update',
    'Ethan Parker',
    'UI Mockup',
    'Voice note',
    'Developers',
  ]);
  const router = useRouter();

  const filterTabs = [
    { id: 'All', label: 'All', icon: 'search-outline', count: 18 },
    { id: 'Chats', label: 'Chats', icon: 'person-outline', count: 5 },
    { id: 'Channels', label: 'Channels', icon: 'megaphone-outline', count: 2 },
    { id: 'Bots', label: 'Bots', icon: 'hardware-chip-outline', count: 1 },
    { id: 'Media', label: 'Media', icon: 'images-outline', count: 6 },
    { id: 'Links', label: 'Links', icon: 'link-outline', count: 4 },
    { id: 'Files', label: 'Files', icon: 'document-text-outline', count: 3 },
  ] as const;

  const trendingTags = ['#telejog', '#updates', '#tech', '#crypto', '#design', '#music', '#ai'];

  // Clear query and cancel focus
  const handleCancelSearch = () => {
    setQuery('');
    setIsFocused(false);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const handleRemoveRecentTag = (tag: string) => {
    setRecentSearches((prev) => prev.filter((t) => t !== tag));
  };

  const handleSelectRecentTag = (tag: string) => {
    setQuery(tag);
  };

  const handleVoiceSearch = () => {
    setVoiceSearchActive(true);
    setTimeout(() => {
      setVoiceSearchActive(false);
      setQuery('Telejog Developers');
    }, 1200);
  };

  // Filter conversations based on query and selected category tab
  const filteredResults = useMemo(() => {
    return dummyConversationData.filter((item) => {
      const title = item.title || item.participant?.name || '';
      const lastMsg = item.lastMessage?.text || '';
      const handle = item.participant?.handle || '';
      const matchesQuery =
        query.trim() === '' ||
        title.toLowerCase().includes(query.toLowerCase()) ||
        lastMsg.toLowerCase().includes(query.toLowerCase()) ||
        handle.toLowerCase().includes(query.toLowerCase());

      if (!matchesQuery) return false;

      if (activeFilter === 'Channels') return item.type === 'channel';
      if (activeFilter === 'Bots') return item.type === 'bot';
      if (activeFilter === 'Chats') return item.type === 'user' || !item.type;
      return true;
    });
  }, [query, activeFilter]);

  // Separate top match and remaining results
  const topMatch = useMemo(() => {
    if (query.trim() === '' || filteredResults.length === 0) return null;
    return filteredResults[0];
  }, [query, filteredResults]);

  const remainingResults = useMemo(() => {
    if (query.trim() === '' || filteredResults.length === 0) return filteredResults;
    return filteredResults.slice(1);
  }, [query, filteredResults]);

  // Highlight query substring
  const renderHighlighted = (text: string, highlight: string, defaultStyle: any) => {
    if (!highlight || highlight.trim() === '') {
      return <Text style={defaultStyle}>{text}</Text>;
    }
    const regex = new RegExp(`(${highlight.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <Text style={defaultStyle}>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <Text key={i} style={styles.highlightText}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. TOP SEARCH BAR HEADER */}
      <View style={styles.header}>
        <View
          style={[
            styles.searchBox,
            isFocused && styles.searchBoxFocused,
          ]}
        >
          {/* Glowing Search Icon */}
          <View style={[styles.searchIconBadge, isFocused && styles.searchIconBadgeFocused]}>
            <Ionicons
              name={voiceSearchActive ? 'mic' : 'search'}
              size={18}
              color={voiceSearchActive ? '#FF6B6B' : isFocused ? '#00A8FF' : '#5E6F85'}
            />
          </View>

          {/* Fully outline-free Text Input on Web and Native */}
          <TextInput
            placeholder={voiceSearchActive ? 'Listening...' : 'Search messages, channels, bots...'}
            placeholderTextColor="#5E6F85"
            style={[
              styles.searchInput,
              Platform.OS === 'web' && ({
                outlineStyle: 'none',
                outlineWidth: 0,
                outlineColor: 'transparent',
                boxShadow: 'none',
              } as any),
            ]}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Action icons inside search box */}
          <View style={styles.searchRightActions}>
            {query.length > 0 ? (
              <TouchableOpacity
                onPress={() => setQuery('')}
                style={styles.actionIconBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={19} color="#8B9BB0" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleVoiceSearch}
                style={styles.actionIconBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={voiceSearchActive ? 'mic' : 'mic-outline'}
                  size={19}
                  color={voiceSearchActive ? '#00A8FF' : '#5E6F85'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Cancel Button if focused or typing */}
        {(isFocused || query.length > 0) && (
          <TouchableOpacity
            onPress={handleCancelSearch}
            style={styles.cancelHeaderBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelHeaderText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. CATEGORY FILTER TABS BAR */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterChip,
                  isActive && styles.activeFilterChip,
                ]}
                onPress={() => setActiveFilter(tab.id as any)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={14}
                  color={isActive ? '#00A8FF' : '#8B9BB0'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.activeFilterText,
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.filterCountBadge,
                    isActive && styles.activeFilterCountBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterCountText,
                      isActive && styles.activeFilterCountText,
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. BODY CONTENT */}
      <View style={styles.body}>
        {query.trim() === '' ? (
          /* ================= EXPLORE SCREEN (WHEN QUERY IS EMPTY) ================= */
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.exploreScroll}>
            {/* If MEDIA Tab is selected */}
            {activeFilter === 'Media' && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeaderTitle}>SHARED MEDIA & PHOTOS</Text>
                  <Text style={styles.badgeSub}>{DUMMY_MEDIA_ITEMS.length} items</Text>
                </View>
                <View style={styles.mediaGrid}>
                  {DUMMY_MEDIA_ITEMS.map((media) => (
                    <TouchableOpacity
                      key={media.id}
                      style={styles.mediaGridItem}
                      onPress={() => router.push(`/chat/${media.chatId}` as any)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: media.url }} style={styles.mediaImage} />
                      <View style={styles.mediaOverlay}>
                        <Text style={styles.mediaSenderText} numberOfLines={1}>
                          {media.sender}
                        </Text>
                        <Text style={styles.mediaDateText}>{media.date}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* If LINKS Tab is selected */}
            {activeFilter === 'Links' && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeaderTitle}>SHARED WEB LINKS</Text>
                  <Text style={styles.badgeSub}>{DUMMY_LINKS_ITEMS.length} links</Text>
                </View>
                <View style={styles.linksContainer}>
                  {DUMMY_LINKS_ITEMS.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.linkCard}
                      onPress={() => router.push(`/chat/${item.chatId}` as any)}
                      activeOpacity={0.75}
                    >
                      <View style={styles.linkIconCircle}>
                        <Ionicons name="globe-outline" size={20} color="#00A8FF" />
                      </View>
                      <View style={styles.linkInfo}>
                        <Text style={styles.linkTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.linkDomain} numberOfLines={1}>
                          {item.domain} · {item.sender}
                        </Text>
                        <Text style={styles.linkSnippet} numberOfLines={2}>
                          {item.snippet}
                        </Text>
                      </View>
                      <Ionicons name="open-outline" size={16} color="#5E6F85" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* If FILES Tab is selected */}
            {activeFilter === 'Files' && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeaderTitle}>DOCUMENTS & FILES</Text>
                  <Text style={styles.badgeSub}>{DUMMY_FILES_ITEMS.length} files</Text>
                </View>
                <View style={styles.filesContainer}>
                  {DUMMY_FILES_ITEMS.map((file) => (
                    <TouchableOpacity
                      key={file.id}
                      style={styles.fileCard}
                      onPress={() => router.push(`/chat/${file.chatId}` as any)}
                      activeOpacity={0.75}
                    >
                      <View style={styles.fileBadgeBox}>
                        <Text style={styles.fileExtensionText}>{file.extension}</Text>
                      </View>
                      <View style={styles.fileInfo}>
                        <Text style={styles.fileTitle} numberOfLines={1}>
                          {file.title}
                        </Text>
                        <Text style={styles.fileMeta}>
                          {file.size} · {file.date} · {file.sender}
                        </Text>
                      </View>
                      <View style={styles.fileDownloadBtn}>
                        <Ionicons name="arrow-down" size={16} color="#00A8FF" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* DEFAULT TAB VIEW: ALL / CHATS / CHANNELS / BOTS */}
            {activeFilter !== 'Media' && activeFilter !== 'Links' && activeFilter !== 'Files' && (
              <>
                {/* 1. FREQUENT CONTACTS CAROUSEL */}
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionHeaderTitle}>FREQUENT CONTACTS</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.recentContactsScroll}
                  >
                    {dummyUsers.map((user: any) => (
                      <TouchableOpacity
                        key={user._id}
                        style={styles.recentContactItem}
                        onPress={() => router.push(`/chat/conv_1` as any)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.recentAvatarContainer}>
                          <Image source={{ uri: user.avatar }} style={styles.recentAvatar} />
                          {user.isOnline && <View style={styles.onlineBadgeDot} />}
                        </View>
                        <Text style={styles.recentContactName} numberOfLines={1}>
                          {user.name.split(' ')[0]}
                        </Text>
                        <Text style={styles.recentContactHandle} numberOfLines={1}>
                          @{user.handle}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* 2. RECENT SEARCHES TAGS */}
                {recentSearches.length > 0 && (
                  <View style={styles.sectionBlock}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionHeaderTitle}>RECENT SEARCHES</Text>
                      <TouchableOpacity
                        onPress={handleClearRecent}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                      >
                        <Text style={styles.clearAllText}>Clear All</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.recentTagsContainer}>
                      {recentSearches.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={styles.searchHistoryTag}
                          onPress={() => handleSelectRecentTag(item)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="time-outline" size={14} color="#00A8FF" style={{ marginRight: 6 }} />
                          <Text style={styles.searchHistoryTagText}>{item}</Text>
                          <TouchableOpacity
                            onPress={() => handleRemoveRecentTag(item)}
                            style={{ marginLeft: 6 }}
                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                          >
                            <Ionicons name="close" size={14} color="#8B9BB0" />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* 3. TRENDING TOPICS / HASHTAGS */}
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionHeaderTitle}>POPULAR TOPICS</Text>
                  <View style={styles.trendingTagsRow}>
                    {trendingTags.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        style={styles.trendingTag}
                        onPress={() => setQuery(tag.replace('#', ''))}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.trendingTagHash}>#</Text>
                        <Text style={styles.trendingTagText}>{tag.replace('#', '')}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 4. DISCOVER PUBLIC CHANNELS & BOTS */}
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeaderTitle}>DISCOVER CHANNELS & BOTS</Text>
                    <Text style={styles.badgeSub}>Global</Text>
                  </View>
                  <View style={styles.discoverCard}>
                    {dummyConversationData
                      .filter((c) => c.type === 'channel' || c.type === 'bot' || c.type === 'group')
                      .map((item, index) => (
                        <TouchableOpacity
                          key={item._id}
                          style={[
                            styles.discoverRow,
                            index > 0 && styles.discoverRowBorder,
                          ]}
                          onPress={() => router.push(`/chat/${item._id}` as any)}
                          activeOpacity={0.75}
                        >
                          <Image source={{ uri: item.avatar }} style={styles.discoverAvatar} />
                          <View style={styles.discoverInfo}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Text style={styles.discoverTitle} numberOfLines={1}>
                                {item.title}
                              </Text>
                              <Ionicons
                                name="checkmark-circle"
                                size={14}
                                color="#00A8FF"
                                style={{ marginLeft: 4 }}
                              />
                            </View>
                            <Text style={styles.discoverMeta}>
                              {item.type === 'channel'
                                ? `${item.membersCount?.toLocaleString()} subscribers`
                                : item.type === 'group'
                                ? `${item.membersCount} members`
                                : 'AI Assistant'}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.joinBtn}
                            onPress={() => router.push(`/chat/${item._id}` as any)}
                          >
                            <Text style={styles.joinBtnText}>
                              {item.type === 'bot' ? 'Start' : 'View'}
                            </Text>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              </>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        ) : (
          /* ================= LIVE SEARCH RESULTS SCREEN ================= */
          <FlatList
            data={remainingResults}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.resultsListContent}
            ListHeaderComponent={() => (
              <View>
                {/* Result Summary Bar */}
                <View style={styles.resultsCountBar}>
                  <Text style={styles.resultsCountText}>
                    Found {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'} for "{query}"
                  </Text>
                </View>

                {/* TOP MATCH SPOTLIGHT CARD */}
                {topMatch && (
                  <View style={styles.topMatchContainer}>
                    <Text style={styles.topMatchHeading}>BEST MATCH</Text>
                    <TouchableOpacity
                      style={styles.topMatchCard}
                      onPress={() => router.push(`/chat/${topMatch._id}` as any)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{
                          uri:
                            topMatch.avatar ||
                            topMatch.participant?.avatar ||
                            'https://i.pravatar.cc/150',
                        }}
                        style={styles.topMatchAvatar}
                      />
                      <View style={styles.topMatchDetails}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {renderHighlighted(
                            topMatch.title || topMatch.participant?.name || 'User',
                            query,
                            styles.topMatchTitle
                          )}
                          <Ionicons
                            name="checkmark-circle"
                            size={15}
                            color="#00A8FF"
                            style={{ marginLeft: 5 }}
                          />
                        </View>
                        <Text style={styles.topMatchHandle}>
                          @{topMatch.participant?.handle || 'telejog_channel'}
                        </Text>
                        <View style={{ marginTop: 4 }}>
                          {renderHighlighted(
                            topMatch.lastMessage?.text || 'Tap to open conversation',
                            query,
                            styles.topMatchMessage
                          )}
                        </View>
                      </View>
                      <View style={styles.topMatchActionBtn}>
                        <Ionicons name="chatbubble-ellipses" size={16} color="#00A8FF" />
                        <Text style={styles.topMatchActionText}>Chat</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                {remainingResults.length > 0 && (
                  <View style={styles.resultsSectionHeader}>
                    <Text style={styles.resultsSectionTitle}>CHATS & PUBLIC RESULTS</Text>
                  </View>
                )}
              </View>
            )}
            renderItem={({ item }) => {
              const avatarUri =
                item.avatar || item.participant?.avatar || 'https://i.pravatar.cc/150';
              const title = item.title || item.participant?.name || 'User';

              return (
                <TouchableOpacity
                  style={styles.resultRow}
                  onPress={() => router.push(`/chat/${item._id}` as any)}
                  activeOpacity={0.75}
                >
                  <View style={styles.resultAvatarBox}>
                    <Image source={{ uri: avatarUri }} style={styles.resultAvatar} />
                    {item.participant?.isOnline && <View style={styles.resultOnlineDot} />}
                  </View>

                  <View style={styles.resultInfo}>
                    <View style={styles.resultTitleRow}>
                      {renderHighlighted(title, query, styles.resultTitle)}
                      {item.participant?.verified && (
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color="#00A8FF"
                          style={{ marginLeft: 4 }}
                        />
                      )}
                    </View>
                    <View style={{ marginTop: 2 }}>
                      {renderHighlighted(
                        item.type === 'channel'
                          ? `${item.membersCount?.toLocaleString()} subscribers`
                          : item.lastMessage?.text || `@${item.participant?.handle || 'user'}`,
                        query,
                        styles.resultSub
                      )}
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={16} color="#5E6F85" />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() =>
              !topMatch ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="search" size={38} color="#00A8FF" />
                  </View>
                  <Text style={styles.emptyTitle}>No results found</Text>
                  <Text style={styles.emptySub}>
                    No messages or channels match "{query}". Try checking for typos or searching a different term.
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyResetBtn}
                    onPress={() => setQuery('')}
                  >
                    <Text style={styles.emptyResetText}>Clear Search</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F17',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#0B0F17',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B2A',
    borderRadius: 22,
    paddingHorizontal: 10,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    // Eliminate web focus outlines on container
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
        } as any)
      : {}),
  },
  searchBoxFocused: {
    borderColor: 'rgba(0, 168, 255, 0.5)',
    backgroundColor: '#162235',
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconBadgeFocused: {
    backgroundColor: 'rgba(0, 168, 255, 0.12)',
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    marginLeft: 8,
    paddingVertical: 0,
    height: '100%',
    // Bulletproof outline removal for browser inputs
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          outlineColor: 'transparent',
          boxShadow: 'none',
        } as any)
      : {}),
  },
  searchRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  actionIconBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelHeaderBtn: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cancelHeaderText: {
    color: '#00A8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  filterBar: {
    paddingVertical: 8,
    backgroundColor: '#0B0F17',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 6.5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  activeFilterChip: {
    backgroundColor: 'rgba(0, 168, 255, 0.15)',
    borderColor: 'rgba(0, 168, 255, 0.45)',
  },
  filterText: {
    color: '#8B9BB0',
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#00A8FF',
    fontWeight: '700',
  },
  filterCountBadge: {
    marginLeft: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  activeFilterCountBadge: {
    backgroundColor: 'rgba(0, 168, 255, 0.3)',
  },
  filterCountText: {
    color: '#8B9BB0',
    fontSize: 10.5,
    fontWeight: '700',
  },
  activeFilterCountText: {
    color: '#FFF',
  },
  body: {
    flex: 1,
    backgroundColor: '#0B0F17',
  },
  exploreScroll: {
    paddingVertical: 14,
  },
  sectionBlock: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    color: '#00A8FF',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 2,
  },
  badgeSub: {
    color: '#5E6F85',
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 12,
  },
  clearAllText: {
    color: '#00A8FF',
    fontSize: 12,
    fontWeight: '600',
  },
  recentContactsScroll: {
    paddingRight: 16,
  },
  recentContactItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 66,
  },
  recentAvatarContainer: {
    position: 'relative',
    padding: 2.5,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 168, 255, 0.4)',
    backgroundColor: '#141C2B',
  },
  recentAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#141C2B',
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#00E676',
    borderWidth: 2,
    borderColor: '#0B0F17',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  recentContactName: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '700',
    textAlign: 'center',
  },
  recentContactHandle: {
    color: '#5E6F85',
    fontSize: 10,
    marginTop: 1,
    textAlign: 'center',
  },
  recentTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  searchHistoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B2A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  searchHistoryTagText: {
    color: '#FFF',
    fontSize: 13,
  },
  trendingTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 168, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 255, 0.22)',
  },
  trendingTagHash: {
    color: '#00A8FF',
    fontWeight: '800',
    fontSize: 13,
    marginRight: 2,
  },
  trendingTagText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  discoverCard: {
    backgroundColor: '#131B2A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    overflow: 'hidden',
  },
  discoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  discoverRowBorder: {
    borderTopWidth: 0.8,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  discoverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1D283E',
  },
  discoverInfo: {
    flex: 1,
    marginLeft: 14,
  },
  discoverTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  discoverMeta: {
    color: '#8B9BB0',
    fontSize: 12,
    marginTop: 2,
  },
  joinBtn: {
    backgroundColor: 'rgba(0, 168, 255, 0.15)',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 255, 0.4)',
  },
  joinBtnText: {
    color: '#00A8FF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  /* Media Grid */
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaGridItem: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#141C2B',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 15, 23, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  mediaSenderText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  mediaDateText: {
    color: '#8B9BB0',
    fontSize: 9,
  },
  /* Links View */
  linksContainer: {
    gap: 10,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B2A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  linkIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 168, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  linkInfo: {
    flex: 1,
    marginRight: 8,
  },
  linkTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  linkDomain: {
    color: '#00A8FF',
    fontSize: 11.5,
    marginTop: 2,
    fontWeight: '600',
  },
  linkSnippet: {
    color: '#8B9BB0',
    fontSize: 11.5,
    marginTop: 3,
    lineHeight: 15,
  },
  /* Files View */
  filesContainer: {
    gap: 10,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B2A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  fileBadgeBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 168, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileExtensionText: {
    color: '#00A8FF',
    fontWeight: '800',
    fontSize: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileTitle: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  fileMeta: {
    color: '#8B9BB0',
    fontSize: 11.5,
    marginTop: 3,
  },
  fileDownloadBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 168, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* Live Search Screen Styles */
  resultsListContent: {
    paddingVertical: 8,
  },
  resultsCountBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsCountText: {
    color: '#8B9BB0',
    fontSize: 12.5,
    fontWeight: '600',
  },
  topMatchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  topMatchHeading: {
    color: '#00A8FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 2,
  },
  topMatchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131E30',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 168, 255, 0.35)',
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  topMatchAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1D283E',
  },
  topMatchDetails: {
    flex: 1,
    marginLeft: 14,
  },
  topMatchTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  topMatchHandle: {
    color: '#8B9BB0',
    fontSize: 12,
    marginTop: 1,
  },
  topMatchMessage: {
    color: '#CAD3DF',
    fontSize: 12.5,
  },
  topMatchActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 168, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 255, 0.35)',
  },
  topMatchActionText: {
    color: '#00A8FF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  resultsSectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsSectionTitle: {
    color: '#5E6F85',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.8,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  resultAvatarBox: {
    position: 'relative',
  },
  resultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#141C2B',
  },
  resultOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00E676',
    borderWidth: 2,
    borderColor: '#0B0F17',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 14,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultTitle: {
    color: '#FFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
  resultSub: {
    color: '#8B9BB0',
    fontSize: 12.5,
  },
  highlightText: {
    color: '#00A8FF',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 168, 255, 0.15)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(0, 168, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySub: {
    color: '#8B9BB0',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyResetBtn: {
    marginTop: 18,
    backgroundColor: 'rgba(0, 168, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 255, 0.35)',
  },
  emptyResetText: {
    color: '#00A8FF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});