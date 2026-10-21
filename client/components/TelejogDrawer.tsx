import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyUserProfile } from '@/assets/assets';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import TelejogLogo from './TelejogLogo';

interface Props {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function TelejogDrawer({ visible, onClose, isDarkMode, onToggleDarkMode }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user) || dummyUserProfile;

  if (!visible) return null;

  const navigateTo = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const handleLogout = () => {
    onClose();
    dispatch(logout());
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={[styles.drawer, { backgroundColor: isDarkMode ? Colors.surface : '#FFFFFF' }]}>
          {/* Header Profile Info with Telejog Brand Aura */}
          <View style={[styles.headerContainer, { backgroundColor: isDarkMode ? '#1F0B18' : Colors.primary }]}>
            <View style={styles.headerTop}>
              <View style={styles.avatarWithBrand}>
                <Image source={{ uri: user.avatar || dummyUserProfile.avatar }} style={styles.avatar} />
                <View style={styles.brandInsigniaBadge}>
                  <TelejogLogo size={18} glow={false} />
                </View>
              </View>

              <TouchableOpacity onPress={onToggleDarkMode} style={styles.themeToggle}>
                <Ionicons
                  name={isDarkMode ? "sunny" : "moon"}
                  size={20}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profilePhone}>{user.phone || dummyUserProfile.phone}</Text>
            <Text style={styles.profileHandle}>@{user.handle || dummyUserProfile.handle}</Text>
          </View>

          {/* Drawer Menu Options */}
          <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="people-outline" size={22} color={isDarkMode ? Colors.textSecondary : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>New Group</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="megaphone-outline" size={22} color={isDarkMode ? Colors.textSecondary : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>New Channel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="person-outline" size={22} color={isDarkMode ? Colors.textSecondary : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Contacts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="call-outline" size={22} color={isDarkMode ? Colors.textSecondary : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Calls</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/chat/conv_1')}>
              <Ionicons name="bookmark-outline" size={22} color={isDarkMode ? Colors.textSecondary : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Saved Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/devices')}>
              <Ionicons name="laptop-outline" size={22} color={isDarkMode ? Colors.textSecondary : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Devices</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile')}>
              <Ionicons name="settings-outline" size={22} color={isDarkMode ? Colors.textSecondary : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Settings</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: isDarkMode ? Colors.divider : '#E6E8EA' }]} />

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="person-add-outline" size={22} color={isDarkMode ? Colors.textSecondary : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Invite Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="help-circle-outline" size={22} color={isDarkMode ? Colors.textSecondary : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Telejog Features & FAQ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#FF4757" />
              <Text style={[styles.menuText, { color: '#FF4757' }]}>Log Out</Text>
            </TouchableOpacity>

            <View style={styles.versionContainer}>
              <Text style={[styles.versionText, { color: isDarkMode ? Colors.textMuted : '#A2A2A2' }]}>
                Telejog v3.2.0 • Ultra-Secure
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  drawer: {
    width: '78%',
    height: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarWithBrand: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  brandInsigniaBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderRadius: 9,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#07080D',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  profileName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  profilePhone: {
    color: Colors.neonMint,
    fontSize: 12.5,
    marginTop: 2,
    fontWeight: '600',
  },
  profileHandle: {
    color: Colors.textSecondary,
    fontSize: 12.5,
    marginTop: 1,
  },
  menuScroll: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 18,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  versionContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
