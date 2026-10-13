import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyConversationData, dummyUsers } from '@/assets/assets';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const router = useRouter();

  const filterTabs = ['All', 'Media', 'Downloads', 'Links', 'Channels', 'Bots'];

  const searchResults = dummyConversationData.filter((item) => {
    const title = item.title || item.participant?.name || '';
    return title.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#7F91A4" />
          <TextInput
            placeholder="Search messages, users, or channels..."
            placeholderTextColor="#7F91A4"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#7F91A4" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterChip,
                activeFilter === tab && styles.activeFilterChip
              ]}
              onPress={() => setActiveFilter(tab)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === tab && styles.activeFilterText
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <View style={styles.body}>
        {query === '' ? (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentGrid}>
              {dummyUsers.slice(0, 5).map((user: any) => (
                <TouchableOpacity
                  key={user._id}
                  style={styles.recentUserItem}
                  onPress={() => router.push(`/chat/conv_1` as any)}
                >
                  <Image source={{ uri: user.avatar }} style={styles.recentAvatar} />
                  <Text style={styles.recentName} numberOfLines={1}>
                    {user.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultRow}
                onPress={() => router.push(`/chat/${item._id}` as any)}
              >
                <Image
                  source={{ uri: item.avatar || item.participant?.avatar || 'https://i.pravatar.cc/150' }}
                  style={styles.resultAvatar}
                />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>
                    {item.title || item.participant?.name}
                  </Text>
                  <Text style={styles.resultSub}>
                    {item.type === 'channel' ? `${item.membersCount?.toLocaleString()} subscribers` : `@${item.participant?.handle || 'telejog_user'}`}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#7F91A4" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#17212B',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#17212B',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242F3D',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 15,
    marginLeft: 8,
  },
  filterBar: {
    paddingVertical: 8,
    backgroundColor: '#17212B',
    borderBottomWidth: 1,
    borderBottomColor: '#101721',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#242F3D',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#2AABEE',
  },
  filterText: {
    color: '#7F91A4',
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFF',
  },
  body: {
    flex: 1,
    backgroundColor: '#0E1621',
  },
  recentSection: {
    padding: 16,
  },
  sectionTitle: {
    color: '#7F91A4',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  recentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentUserItem: {
    alignItems: 'center',
    width: 60,
  },
  recentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  recentName: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 6,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#101721',
  },
  resultAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 14,
  },
  resultTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSub: {
    color: '#7F91A4',
    fontSize: 13,
    marginTop: 2,
  },
});