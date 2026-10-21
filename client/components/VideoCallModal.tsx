import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  participantName: string;
  participantAvatar: string;
  onEndCall: () => void;
}

export default function VideoCallModal({
  visible,
  participantName,
  participantAvatar,
  onEndCall,
}: Props) {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  useEffect(() => {
    let timer: any;
    if (visible) {
      setSeconds(0);
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visible]);

  if (!visible) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onEndCall}>
      <SafeAreaView style={styles.container}>
        {/* Top Bar with HD indicator & minimize */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onEndCall} style={styles.iconCircle}>
            <Ionicons name="chevron-down" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.encryptedBadge}>
            <Ionicons name="lock-closed" size={13} color={Colors.neonMint} style={{ marginRight: 4 }} />
            <Text style={styles.encryptedText}>End-to-End Encrypted</Text>
          </View>
          <View style={styles.hdBadge}>
            <Text style={styles.hdText}>HD</Text>
          </View>
        </View>

        {/* Remote Video Stream Simulation & Avatar */}
        <View style={styles.callerContainer}>
          <View style={styles.avatarRings}>
            <View style={styles.outerGlowRing} />
            <Image source={{ uri: participantAvatar }} style={styles.callerAvatar} />
          </View>

          <Text style={styles.callerName}>{participantName}</Text>
          <Text style={styles.callDuration}>
            {seconds === 0 ? 'Connecting...' : formatTime(seconds)}
          </Text>
        </View>

        {/* Pip Self Camera Preview */}
        {!isVideoDisabled && (
          <View style={styles.pipCamera}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }}
              style={styles.pipImage}
            />
            <View style={styles.pipBadge}>
              <Text style={styles.pipBadgeText}>You</Text>
            </View>
          </View>
        )}

        {/* In-Call Controls Dock */}
        <View style={styles.controlsDock}>
          <TouchableOpacity
            style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Ionicons
              name={isMuted ? 'mic-off' : 'mic'}
              size={24}
              color={isMuted ? '#FF4757' : '#FFF'}
            />
            <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, isVideoDisabled && styles.controlBtnActive]}
            onPress={() => setIsVideoDisabled(!isVideoDisabled)}
          >
            <Ionicons
              name={isVideoDisabled ? 'videocam-off' : 'videocam'}
              size={24}
              color={isVideoDisabled ? '#FF4757' : '#FFF'}
            />
            <Text style={styles.controlLabel}>{isVideoDisabled ? 'Start Video' : 'Stop Video'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, !isSpeakerOn && styles.controlBtnActive]}
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            <Ionicons
              name={isSpeakerOn ? 'volume-high' : 'volume-mute'}
              size={24}
              color="#FFF"
            />
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity style={styles.endCallBtn} onPress={onEndCall}>
            <Ionicons name="call" size={28} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080D',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  encryptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 212, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 212, 0.3)',
  },
  encryptedText: {
    color: Colors.neonMint,
    fontSize: 12,
    fontWeight: '600',
  },
  hdBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hdText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  callerContainer: {
    alignItems: 'center',
    marginVertical: 'auto',
  },
  avatarRings: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  outerGlowRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 42, 133, 0.18)',
    borderWidth: 2,
    borderColor: 'rgba(255, 42, 133, 0.5)',
  },
  callerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  callerName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  callDuration: {
    color: Colors.neonMint,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  pipCamera: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 100,
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  pipImage: {
    width: '100%',
    height: '100%',
  },
  pipBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pipBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  controlsDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#111420',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  controlBtnActive: {
    opacity: 0.8,
  },
  controlLabel: {
    color: '#8B9BB0',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  endCallBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF4757',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
});
