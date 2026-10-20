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
                color={isActive ? Colors.primary : Colors.textMuted}
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
                  <Text style={[styles.badgeText, isActive && styles.activeBadgeText]}>
                    {unread}
                  </Text>
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
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
    backgroundColor: 'rgba(0, 245, 212, 0.12)',
    borderColor: 'rgba(0, 245, 212, 0.4)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  activeBadge: {
    backgroundColor: Colors.primary,
  },
  inactiveBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  activeBadgeText: {
    color: '#08090E',
    fontWeight: '800',
  },
});
