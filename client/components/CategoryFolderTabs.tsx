import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export type ChatCategory = 'all' | 'channels' | 'groups' | 'bots' | 'personal';

interface Props {
  activeCategory: ChatCategory;
  onSelectCategory: (category: ChatCategory) => void;
  isDarkMode: boolean;
  unreadCounts: Record<ChatCategory, number>;
}

export default function CategoryFolderTabs({
  activeCategory,
  onSelectCategory,
  isDarkMode,
  unreadCounts,
}: Props) {
  const categories: {
    id: ChatCategory;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { id: 'all', label: 'All', icon: 'chatbubbles-outline' },
    { id: 'personal', label: 'Personal', icon: 'person-outline' },
    { id: 'channels', label: 'Channels', icon: 'megaphone-outline' },
    { id: 'groups', label: 'Groups', icon: 'people-outline' },
    { id: 'bots', label: 'Bots', icon: 'hardware-chip-outline' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const unread = unreadCounts[cat.id] || 0;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.tabCapsule, isActive && styles.activeTabCapsule]}
              activeOpacity={0.75}
              onPress={() => onSelectCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon}
                size={14}
                color={isActive ? '#00A8FF' : '#8B9BB0'}
                style={{ marginRight: 6 }}
              />

              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {cat.label}
              </Text>

              {unread > 0 && (
                <View
                  style={[
                    styles.badge,
                    isActive ? styles.activeBadge : styles.inactiveBadge,
                  ]}
                >
                  <Text style={styles.badgeText}>{unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: '#0E1420',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  tabCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTabCapsule: {
    backgroundColor: 'rgba(0, 168, 255, 0.12)',
    borderColor: 'rgba(0, 168, 255, 0.35)',
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8B9BB0',
  },
  activeTabText: {
    color: '#00A8FF',
    fontWeight: 'bold',
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  activeBadge: {
    backgroundColor: '#00A8FF',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
