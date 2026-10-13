import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyUserProfile } from '@/assets/assets';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

interface Props {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function TelegramDrawer({ visible, onClose, isDarkMode, onToggleDarkMode }: Props) {
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

        <View style={[styles.drawer, { backgroundColor: isDarkMode ? '#17212B' : '#FFFFFF' }]}>
          {/* Header Profile Info */}
          <View style={[styles.headerContainer, { backgroundColor: isDarkMode ? '#242F3D' : '#517DA2' }]}>
            <View style={styles.headerTop}>
              <Image source={{ uri: user.avatar || dummyUserProfile.avatar }} style={styles.avatar} />
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
              <Ionicons name="people-outline" size={22} color={isDarkMode ? '#7F91A4' : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>New Group</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="megaphone-outline" size={22} color={isDarkMode ? '#7F91A4' : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>New Channel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="person-outline" size={22} color={isDarkMode ? '#7F91A4' : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Contacts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="call-outline" size={22} color={isDarkMode ? '#7F91A4' : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Calls</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/chat/conv_1')}>
              <Ionicons name="bookmark-outline" size={22} color={isDarkMode ? '#7F91A4' : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Saved Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/devices')}>
              <Ionicons name="laptop-outline" size={22} color={isDarkMode ? '#7F91A4' : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Devices</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile')}>
              <Ionicons name="settings-outline" size={22} color={isDarkMode ? '#7F91A4' : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Settings</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#101721' : '#E6E8EA' }]} />

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="person-add-outline" size={22} color={isDarkMode ? '#7F91A4' : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Invite Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
              <Ionicons name="help-circle-outline" size={22} color={isDarkMode ? '#7F91A4' : '#707579'} />
              <Text style={[styles.menuText, { color: isDarkMode ? '#FFF' : '#000' }]}>Telejog Features & FAQ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#E53935" />
              <Text style={[styles.menuText, { color: '#E53935' }]}>Log Out</Text>
            </TouchableOpacity>

            <View style={styles.versionContainer}>
              <Text style={[styles.versionText, { color: isDarkMode ? '#4E5D6E' : '#A2A2A2' }]}>
                Telejog for Mobile v3.2.0
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    width: '78%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  profileName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  profilePhone: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  profileHandle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  menuScroll: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 24,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  versionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
  },
});
