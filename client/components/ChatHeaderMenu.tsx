import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onVideoCall: () => void;
  onSearch: () => void;
  onSetWallpaper: () => void;
  onClearHistory: () => void;
  onDeleteChat: () => void;
  participantName: string;
}

export default function ChatHeaderMenu({
  visible,
  onClose,
  onVideoCall,
  onSearch,
  onSetWallpaper,
  onClearHistory,
  onDeleteChat,
  participantName,
}: Props) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              {/* Header label */}
              <View style={styles.menuHeader}>
                <Text style={styles.menuHeaderText} numberOfLines={1}>
                  Chat with {participantName}
                </Text>
              </View>

              {/* 1. Video Call */}
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  onVideoCall();
                }}
              >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 245, 212, 0.12)' }]}>
                  <Ionicons name="videocam-outline" size={19} color={Colors.neonMint} />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemTitle}>Video Call</Text>
                  <Text style={styles.itemSubtitle}>Start live HD video call</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* 2. Search */}
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  onSearch();
                }}
              >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
                  <Ionicons name="search-outline" size={19} color="#38BDF8" />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemTitle}>Search in Chat</Text>
                  <Text style={styles.itemSubtitle}>Find messages, files & media</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* 3. Set Wallpaper */}
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  onSetWallpaper();
                }}
              >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 42, 133, 0.15)' }]}>
                  <Ionicons name="color-palette-outline" size={19} color={Colors.primary} />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemTitle}>Set Wallpaper</Text>
                  <Text style={styles.itemSubtitle}>Customize chat background themes</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* 4. Clear History */}
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  onClearHistory();
                }}
              >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(234, 179, 8, 0.14)' }]}>
                  <Ionicons name="trash-outline" size={19} color="#EAB308" />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemTitle}>Clear History</Text>
                  <Text style={styles.itemSubtitle}>Delete messages for you or friend</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* 5. Delete Chat */}
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  onClose();
                  onDeleteChat();
                }}
              >
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 71, 87, 0.15)' }]}>
                  <Ionicons name="close-circle-outline" size={19} color="#FF4757" />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={[styles.itemTitle, { color: '#FF4757' }]}>Delete Chat</Text>
                  <Text style={styles.itemSubtitle}>Permanently remove conversation</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 95 : 68,
    paddingRight: 14,
  },
  menuContainer: {
    width: 270,
    backgroundColor: '#111420',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 133, 0.25)',
    paddingVertical: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 12,
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 4,
  },
  menuHeaderText: {
    color: '#8B9BB0',
    fontSize: 11.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: '#6D7E94',
    fontSize: 11,
    marginTop: 1,
  },
  divider: {
    height: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginHorizontal: 14,
  },
});
