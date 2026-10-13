import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserStory } from '@/types';
import { Colors } from '@/constants/Colors';
import StoryViewerModal from './StoryViewerModal';

interface Props {
  stories: UserStory[];
}

export default function StoriesBar({ stories }: Props) {
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Add My Story */}
        <TouchableOpacity style={styles.storyItem}>
          <View style={styles.myStoryContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=68' }}
              style={styles.avatar}
            />
            <View style={styles.addBadge}>
              <Ionicons name="add" size={14} color="#FFF" />
            </View>
          </View>
          <Text style={styles.nameText} numberOfLines={1}>My Story</Text>
        </TouchableOpacity>

        {/* User Stories */}
        {stories.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.storyItem}
            onPress={() => setSelectedStory(item)}
          >
            <View
              style={[
                styles.storyRing,
                item.hasUnseen ? styles.unseenRing : styles.seenRing
              ]}
            >
              <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            </View>
            <Text style={styles.nameText} numberOfLines={1}>
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
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderBottomWidth: 0.5,
    borderBottomColor: '#242F3D',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 62,
  },
  myStoryContainer: {
    position: 'relative',
    padding: 2,
  },
  addBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#17212B',
  },
  storyRing: {
    padding: 2.5,
    borderRadius: 33,
  },
  unseenRing: {
    borderWidth: 2.5,
    borderColor: Colors.primary,
  },
  seenRing: {
    borderWidth: 1.5,
    borderColor: '#374252',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  nameText: {
    color: '#7F91A4',
    fontSize: 11.5,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
});