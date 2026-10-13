import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserStory } from '@/types';
import { Colors } from '@/constants/Colors';
import StoryViewerModal from './StoryViewerModal';
import { useAppSelector } from '@/store/hooks';
import { dummyUserProfile } from '@/assets/assets';

interface Props {
  stories: UserStory[];
}

export default function StoriesBar({ stories }: Props) {
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const currentUser = useAppSelector((state) => state.auth.user) || dummyUserProfile;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add My Story Button */}
        <TouchableOpacity style={styles.storyItem} activeOpacity={0.8}>
          <View style={styles.myStoryWrapper}>
            <Image
              source={{ uri: currentUser.avatar || 'https://i.pravatar.cc/150?img=68' }}
              style={styles.avatar}
            />
            <View style={styles.addBadge}>
              <Ionicons name="add" size={15} color="#FFF" />
            </View>
          </View>
          <Text style={styles.myStoryText} numberOfLines={1}>Your story</Text>
        </TouchableOpacity>

        {/* User Stories with Neon Gradient Rings */}
        {stories.map((item, idx) => (
          <TouchableOpacity
            key={item.user._id || idx}
            style={styles.storyItem}
            activeOpacity={0.8}
            onPress={() => setSelectedStory(item)}
          >
            <View
              style={[
                styles.storyRingWrapper,
                item.hasUnseen ? styles.unseenRing : styles.seenRing,
              ]}
            >
              <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            </View>
            <Text
              style={[
                styles.nameText,
                item.hasUnseen && styles.unseenNameText,
              ]}
              numberOfLines={1}
            >
              {item.user.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Story Viewer Modal */}
      <StoryViewerModal
        visible={!!selectedStory}
        userStory={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: '#0E1420',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  scrollContent: {
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 66,
  },
  myStoryWrapper: {
    position: 'relative',
    padding: 3,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  addBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#00A8FF',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#0E1420',
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  storyRingWrapper: {
    padding: 3,
    borderRadius: 34,
    borderWidth: 2,
  },
  unseenRing: {
    borderColor: '#00A8FF',
    shadowColor: '#00A8FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 3,
  },
  seenRing: {
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  myStoryText: {
    color: '#8B9BB0',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  nameText: {
    color: '#8B9BB0',
    fontSize: 11.5,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  unseenNameText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});