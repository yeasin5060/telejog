import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      setReplyText('');
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
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Top Progress Bar */}
        <View style={styles.progressContainer}>
          {userStory.stories.map((_, idx) => (
            <View key={idx} style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  { width: idx <= currentIndex ? '100%' : '0%' },
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

        {/* Touch Navigation Overlay */}
        <View style={styles.touchArea}>
          <TouchableOpacity style={styles.touchLeft} onPress={handlePrev} />
          <TouchableOpacity style={styles.touchRight} onPress={handleNext} />
        </View>

        {/* Story Caption & Quick Reply Input */}
        <View style={styles.bottomOverlay}>
          {currentStory.caption && (
            <View style={styles.captionBox}>
              <Text style={styles.captionText}>{currentStory.caption}</Text>
            </View>
          )}

          <View style={styles.replyBar}>
            <TextInput
              placeholder="Send a reply..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.replyInput}
              value={replyText}
              onChangeText={setReplyText}
            />
            <TouchableOpacity style={styles.likeBtn}>
              <Ionicons name="heart" size={24} color="#FF4757" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendStoryBtn} onPress={onClose}>
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 12,
    paddingTop: 16,
    zIndex: 10,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00A8FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00A8FF',
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
    padding: 6,
  },
  media: {
    width: width,
    height: height * 0.72,
    alignSelf: 'center',
    marginVertical: 'auto',
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
  bottomOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 14,
    right: 14,
    zIndex: 10,
  },
  captionBox: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  captionText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 28, 43, 0.9)',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  replyInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  likeBtn: {
    padding: 6,
    marginRight: 4,
  },
  sendStoryBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00A8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
