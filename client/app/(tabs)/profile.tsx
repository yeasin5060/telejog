import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyUserProfile } from '@/assets/assets';

// Preset avatar options for quick selection
const PRESET_AVATARS = [
  'https://i.pravatar.cc/150?img=68',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=33',
  'https://i.pravatar.cc/150?img=47',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
];

export default function ProfileScreen() {
  const router = useRouter();

  // User Profile State
  const [profile, setProfile] = useState({
    name: dummyUserProfile.name,
    phone: dummyUserProfile.phone,
    handle: dummyUserProfile.handle,
    bio: dummyUserProfile.bio,
    avatar: dummyUserProfile.avatar,
    lastSeen: dummyUserProfile.lastSeen,
  });

  // Edit Profile Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.handle);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);

  // Settings State
  const [isNightMode, setIsNightMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleOpenEditModal = () => {
    setEditName(profile.name);
    setEditHandle(profile.handle);
    setEditBio(profile.bio);
    setEditPhone(profile.phone);
    setEditAvatar(profile.avatar);
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      showToast('Name cannot be empty');
      return;
    }

    setProfile({
      ...profile,
      name: editName.trim(),
      handle: editHandle.replace('@', '').trim(),
      bio: editBio.trim(),
      phone: editPhone.trim(),
      avatar: editAvatar,
    });

    setShowEditModal(false);
    showToast('Profile updated successfully! ✨');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Profile</Text>
          <TouchableOpacity style={styles.editHeaderBtn} onPress={handleOpenEditModal}>
            <Ionicons name="pencil-outline" size={20} color="#2AABEE" style={{ marginRight: 4 }} />
            <Text style={styles.editHeaderBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Cover & Avatar Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraBtn} onPress={handleOpenEditModal}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.nameText}>{profile.name}</Text>
          <Text style={styles.statusText}>{profile.lastSeen}</Text>
        </View>

        {/* Account Info Card (Tappable to Edit) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Account</Text>
            <TouchableOpacity onPress={handleOpenEditModal}>
              <Text style={styles.sectionHeaderEdit}>Edit</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.infoRow} onPress={handleOpenEditModal}>
            <Ionicons name="call-outline" size={22} color="#2AABEE" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{profile.phone}</Text>
              <Text style={styles.infoSub}>Tap to change phone number</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#4E5D6E" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.infoRow} onPress={handleOpenEditModal}>
            <Ionicons name="at-outline" size={22} color="#2AABEE" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>@{profile.handle}</Text>
              <Text style={styles.infoSub}>Username</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#4E5D6E" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.infoRow} onPress={handleOpenEditModal}>
            <Ionicons name="information-circle-outline" size={22} color="#2AABEE" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{profile.bio || 'No bio set'}</Text>
              <Text style={styles.infoSub}>Bio</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#4E5D6E" />
          </TouchableOpacity>
        </View>

        {/* Telegram Settings Options */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Settings</Text>

          {/* MANAGE DEVICES MENU ITEM */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/devices')}
            activeOpacity={0.7}
          >
            <Ionicons name="laptop-outline" size={22} color="#2AABEE" />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.menuTitle}>Devices</Text>
              <Text style={styles.menuSubTitle}>Manage active sessions & desktop</Text>
            </View>
            <View style={styles.deviceBadge}>
              <Text style={styles.deviceBadgeText}>5 active</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#7F91A4" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#7F91A4" />
            <Text style={styles.menuTitle}>Chat Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#7F91A4" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <Ionicons name="lock-closed-outline" size={22} color="#7F91A4" />
            <Text style={styles.menuTitle}>Privacy and Security</Text>
            <Ionicons name="chevron-forward" size={18} color="#7F91A4" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <Ionicons name="notifications-outline" size={22} color="#7F91A4" />
            <Text style={styles.menuTitle}>Notifications and Sounds</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#242F3D', true: '#2AABEE' }}
              thumbColor="#FFF"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <Ionicons name="folder-open-outline" size={22} color="#7F91A4" />
            <Text style={styles.menuTitle}>Data and Storage</Text>
            <Ionicons name="chevron-forward" size={18} color="#7F91A4" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <Ionicons name="moon-outline" size={22} color="#7F91A4" />
            <Text style={styles.menuTitle}>Night Mode</Text>
            <Switch
              value={isNightMode}
              onValueChange={setIsNightMode}
              trackColor={{ false: '#242F3D', true: '#2AABEE' }}
              thumbColor="#FFF"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <Ionicons name="globe-outline" size={22} color="#7F91A4" />
            <Text style={styles.menuTitle}>Language</Text>
            <Text style={styles.menuBadgeText}>English / বাংলা</Text>
          </TouchableOpacity>
        </View>

        {/* Telejog Premium Banner */}
        <TouchableOpacity style={styles.premiumCard} activeOpacity={0.85}>
          <MaterialCommunityIcons name="star-circle" size={32} color="#FFD700" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.premiumTitle}>Telejog Premium</Text>
            <Text style={styles.premiumSub}>Unlock animated emojis, 4GB file uploads & faster downloads.</Text>
          </View>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => showToast('Logging out...')}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <Modal
          visible={showEditModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEditModal(false)}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <View style={styles.editProfileSheet}>
              {/* Modal Header */}
              <View style={styles.editModalHeader}>
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  style={styles.cancelModalBtn}
                >
                  <Text style={styles.cancelModalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.editModalTitle}>Edit Profile</Text>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  style={styles.saveModalBtn}
                >
                  <Text style={styles.saveModalBtnText}>Done</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.editModalScroll} showsVerticalScrollIndicator={false}>
                {/* Avatar Preview & Presets */}
                <View style={styles.avatarEditContainer}>
                  <Image source={{ uri: editAvatar }} style={styles.editAvatarImage} />
                  <Text style={styles.chooseAvatarLabel}>Choose Avatar</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.avatarPresetsScroll}
                  >
                    {PRESET_AVATARS.map((url, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setEditAvatar(url)}
                        style={[
                          styles.presetAvatarBtn,
                          editAvatar === url && styles.presetAvatarBtnSelected,
                        ]}
                      >
                        <Image source={{ uri: url }} style={styles.presetAvatarThumb} />
                        {editAvatar === url && (
                          <View style={styles.avatarCheckBadge}>
                            <Ionicons name="checkmark" size={12} color="#FFF" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Form Fields */}
                <View style={styles.editFormCard}>
                  <View style={styles.inputFieldGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.formInput}
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Your Name"
                      placeholderTextColor="#7F91A4"
                    />
                  </View>

                  <View style={styles.fieldDivider} />

                  <View style={styles.inputFieldGroup}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={styles.handleInputRow}>
                      <Text style={styles.atPrefix}>@</Text>
                      <TextInput
                        style={[styles.formInput, { flex: 1 }]}
                        value={editHandle}
                        onChangeText={setEditHandle}
                        placeholder="username"
                        placeholderTextColor="#7F91A4"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  <View style={styles.fieldDivider} />

                  <View style={styles.inputFieldGroup}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.formInput}
                      value={editPhone}
                      onChangeText={setEditPhone}
                      placeholder="+880 1700-000000"
                      placeholderTextColor="#7F91A4"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.fieldDivider} />

                  <View style={styles.inputFieldGroup}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.inputLabel}>Bio</Text>
                      <Text style={styles.bioCounterText}>{editBio.length}/70</Text>
                    </View>
                    <TextInput
                      style={[styles.formInput, styles.bioInput]}
                      value={editBio}
                      onChangeText={(txt) => setEditBio(txt.slice(0, 70))}
                      placeholder="Any details such as age, occupation or city."
                      placeholderTextColor="#7F91A4"
                      multiline
                    />
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  style={styles.saveProfileLargeBtn}
                  activeOpacity={0.85}
                  onPress={handleSaveProfile}
                >
                  <Ionicons name="checkmark" size={18} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.saveProfileLargeBtnText}>Save Profile Changes</Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E1621',
  },
  container: {
    flex: 1,
  },
  topBar: {
    height: 52,
    backgroundColor: '#17212B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#101721',
  },
  topBarTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  editHeaderBtnText: {
    color: '#2AABEE',
    fontSize: 15,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#17212B',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#2AABEE',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2AABEE',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#17212B',
  },
  nameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  statusText: {
    color: '#40A7E3',
    fontSize: 13,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#17212B',
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeader: {
    color: '#2AABEE',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  sectionHeaderEdit: {
    color: '#2AABEE',
    fontSize: 13,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
  infoSub: {
    color: '#7F91A4',
    fontSize: 12,
    marginTop: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuTitle: {
    color: '#FFF',
    fontSize: 15,
    marginLeft: 16,
    flex: 1,
  },
  menuSubTitle: {
    color: '#7F91A4',
    fontSize: 12,
    marginTop: 2,
  },
  deviceBadge: {
    backgroundColor: 'rgba(42, 171, 238, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
  },
  deviceBadgeText: {
    color: '#2AABEE',
    fontSize: 12,
    fontWeight: '600',
  },
  menuBadgeText: {
    color: '#7F91A4',
    fontSize: 13,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#101721',
    marginLeft: 38,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242F3D',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  premiumTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumSub: {
    color: '#7F91A4',
    fontSize: 12,
    marginTop: 2,
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: 'rgba(229, 57, 53, 0.15)',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(23, 33, 43, 0.95)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2AABEE',
    zIndex: 999,
  },
  toastText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  editProfileSheet: {
    flex: 1,
    backgroundColor: '#0E1621',
  },
  editModalHeader: {
    height: 56,
    backgroundColor: '#17212B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#101721',
  },
  cancelModalBtn: {
    padding: 6,
  },
  cancelModalBtnText: {
    color: '#7F91A4',
    fontSize: 15,
  },
  editModalTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  saveModalBtn: {
    padding: 6,
  },
  saveModalBtnText: {
    color: '#2AABEE',
    fontSize: 15,
    fontWeight: 'bold',
  },
  editModalScroll: {
    flex: 1,
  },
  avatarEditContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#17212B',
    borderBottomWidth: 1,
    borderBottomColor: '#101721',
  },
  editAvatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#2AABEE',
    marginBottom: 10,
  },
  chooseAvatarLabel: {
    color: '#7F91A4',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  avatarPresetsScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  presetAvatarBtn: {
    marginHorizontal: 6,
    position: 'relative',
    borderRadius: 28,
  },
  presetAvatarBtnSelected: {
    borderWidth: 2,
    borderColor: '#2AABEE',
  },
  presetAvatarThumb: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2AABEE',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editFormCard: {
    backgroundColor: '#17212B',
    marginTop: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#101721',
  },
  inputFieldGroup: {
    paddingVertical: 12,
  },
  inputLabel: {
    color: '#2AABEE',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  formInput: {
    color: '#FFF',
    fontSize: 15,
    paddingVertical: 4,
  },
  handleInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atPrefix: {
    color: '#7F91A4',
    fontSize: 16,
    marginRight: 4,
  },
  bioInput: {
    minHeight: 40,
    textAlignVertical: 'top',
  },
  bioCounterText: {
    color: '#7F91A4',
    fontSize: 11,
  },
  fieldDivider: {
    height: 0.5,
    backgroundColor: '#101721',
  },
  saveProfileLargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2AABEE',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveProfileLargeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});