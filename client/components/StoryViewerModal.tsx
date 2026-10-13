import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserStory } from '@/types';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  userStory: UserStory | null;
  onClose: () => void;
}

export default function StoryViewerModal({ visible, userStory, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
    }
  }, [visible]);

  if (!userStory || !userStory.stories[currentIndex]) return null;

  const currentStory = userStory.stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < userStory.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <SafeAreaView style={styles.container}>
        {/* Top Progress Bar */}
        <View style={styles.progressContainer}>
          {userStory.stories.map((_, idx) => (
            <View key={idx} style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  { width: idx <= currentIndex ? '100%' : '0%' }
                ]}
              />
            </View>
          ))}
        </View>

        {/* User Info Header */}
        <View style={styles.header}>
          <Image source={{ uri: userStory.user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userStory.user.name}</Text>
            <Text style={styles.timeText}>Just now</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Main Image */}
        <Image source={{ uri: currentStory.mediaUrl }} style={styles.media} resizeMode="cover" />

        {/* Story Caption */}
        {currentStory.caption && (
          <View style={styles.captionBox}>
            <Text style={styles.captionText}>{currentStory.caption}</Text>
          </View>
        )}

        {/* Touch Navigation Overlay */}
        <View style={styles.touchArea}>
          <TouchableOpacity style={styles.touchLeft} onPress={handlePrev} />
          <TouchableOpacity style={styles.touchRight} onPress={handleNext} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 15,
    zIndex: 10,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    zIndex: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  timeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  closeBtn: {
    padding: 5,
  },
  media: {
    width: width,
    height: height * 0.75,
    alignSelf: 'center',
    marginVertical: 'auto',
  },
  captionBox: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 10,
    zIndex: 10,
  },
  captionText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  touchArea: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    zIndex: 5,
  },
  touchLeft: {
    flex: 1,
  },
  touchRight: {
    flex: 1,
  },
});
