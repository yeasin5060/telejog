import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export type ChatCategory = 'all' | 'channels' | 'groups' | 'bots' | 'personal';

interface Props {
  activeCategory: ChatCategory;
  onSelectCategory: (category: ChatCategory) => void;
  isDarkMode: boolean;
  unreadCounts: Record<ChatCategory, number>;
}

export default function CategoryFolderTabs({ activeCategory, onSelectCategory, isDarkMode, unreadCounts }: Props) {
  const categories: { id: ChatCategory; label: string; icon?: string }[] = [
    { id: 'all', label: 'All Chats' },
    { id: 'channels', label: 'Channels 📢' },
    { id: 'groups', label: 'Groups 👥' },
    { id: 'bots', label: 'Bots 🤖' },
    { id: 'personal', label: 'Personal 💬' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#17212B' : '#517DA2' }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const unread = unreadCounts[cat.id] || 0;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.tabItem,
                isActive && styles.activeTabItem,
              ]}
              onPress={() => onSelectCategory(cat.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? '#2AABEE' : 'rgba(255,255,255,0.7)' },
                  isActive && styles.activeTabText,
                ]}
              >
                {cat.label}
              </Text>
              {unread > 0 && (
                <View style={[styles.badge, { backgroundColor: isActive ? '#2AABEE' : 'rgba(255,255,255,0.3)' }]}>
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
    position: 'relative',
  },
  activeTabItem: {},
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: '#2AABEE',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
