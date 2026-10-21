import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { dummyUserProfile } from '@/assets/assets';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, updateUserProfile } from '@/store/slices/authSlice';

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
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user) || dummyUserProfile;

  // Edit Profile Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editHandle, setEditHandle] = useState(user.handle);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar || PRESET_AVATARS[0]);

  // Logout Confirmation Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Settings State
  const [isNightMode, setIsNightMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditHandle(user.handle);
      setEditBio(user.bio || '');
      setEditPhone(user.phone || '');
      setEditAvatar(user.avatar || PRESET_AVATARS[0]);
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleOpenEditModal = () => {
    setEditName(user.name);
    setEditHandle(user.handle);
    setEditBio(user.bio || '');
    setEditPhone(user.phone || '');
    setEditAvatar(user.avatar || PRESET_AVATARS[0]);
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      showToast('Name cannot be empty');
      return;
    }

    dispatch(
      updateUserProfile({
        name: editName.trim(),
        handle: editHandle.replace('@', '').trim(),
        bio: editBio.trim(),
        phone: editPhone.trim(),
        avatar: editAvatar,
      })
    );

    setShowEditModal(false);
    showToast('Profile updated successfully! ✨');
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    showToast('Logging out...');
    setTimeout(() => {
      dispatch(logout());
    }, 200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Settings</Text>
        <TouchableOpacity style={styles.editHeaderBtn} onPress={handleOpenEditModal} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={19} color={Colors.primary} style={{ marginRight: 4 }} />
          <Text style={styles.editHeaderBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Hero Section */}
        <View style={styles.header}>
          <View style={styles.avatarGlowWrapper}>
            <Image source={{ uri: user.avatar || PRESET_AVATARS[0] }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraBtn} onPress={handleOpenEditModal} activeOpacity={0.8}>
              <Ionicons name="camera" size={15} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{user.name}</Text>
            <Ionicons name="checkmark-circle" size={18} color={Colors.neonMint} style={{ marginLeft: 6 }} />
          </View>
          <Text style={styles.handleText}>@{user.handle}</Text>

          <View style={styles.statusPill}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        {/* Account Info Card */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeader}>ACCOUNT</Text>
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.infoRow} onPress={handleOpenEditModal} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 42, 133, 0.15)' }]}>
                <Ionicons name="call" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{user.phone || '+880 1700-000000'}</Text>
                <Text style={styles.infoSub}>Tap to change phone number</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#5E6F85" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.infoRow} onPress={handleOpenEditModal} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Ionicons name="at" size={18} color="#A855F7" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>@{user.handle}</Text>
                <Text style={styles.infoSub}>Username</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#5E6F85" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.infoRow} onPress={handleOpenEditModal} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                <Ionicons name="information-circle" size={18} color="#22C55E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{user.bio || 'Bio not set'}</Text>
                <Text style={styles.infoSub}>Bio</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#5E6F85" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Telejog Settings Options */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeader}>SETTINGS</Text>
          <View style={styles.cardContainer}>
            {/* MANAGE DEVICES */}
            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => router.push('/devices')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 245, 212, 0.15)' }]}>
                <Ionicons name="laptop-outline" size={18} color={Colors.neonMint} />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.menuTitle}>Devices</Text>
                <Text style={styles.menuSubTitle}>Manage active sessions & desktop</Text>
              </View>
              <View style={styles.deviceBadge}>
                <Text style={styles.deviceBadgeText}>5 active</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#5E6F85" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Ionicons name="chatbubble-ellipses" size={18} color="#38BDF8" />
              </View>
              <Text style={styles.menuTitle}>Chat Settings</Text>
              <Ionicons name="chevron-forward" size={16} color="#5E6F85" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(234, 179, 8, 0.15)' }]}>
                <Ionicons name="shield-checkmark" size={18} color="#EAB308" />
              </View>
              <Text style={styles.menuTitle}>Privacy and Security</Text>
              <Ionicons name="chevron-forward" size={16} color="#5E6F85" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                <Ionicons name="notifications" size={18} color="#EC4899" />
              </View>
              <Text style={styles.menuTitle}>Notifications and Sounds</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#1D283E', true: Colors.primary }}
                thumbColor="#FFF"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <Ionicons name="folder-open" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.menuTitle}>Data and Storage</Text>
              <Ionicons name="chevron-forward" size={16} color="#5E6F85" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <Ionicons name="moon" size={18} color="#6366F1" />
              </View>
              <Text style={styles.menuTitle}>Night Mode</Text>
              <Switch
                value={isNightMode}
                onValueChange={setIsNightMode}
                trackColor={{ false: '#1D283E', true: Colors.primary }}
                thumbColor="#FFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Telejog Premium Luxury Card */}
        <TouchableOpacity style={styles.premiumCard} activeOpacity={0.85}>
          <View style={styles.premiumIconBox}>
            <MaterialCommunityIcons name="star-four-points" size={26} color="#FFD700" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.premiumTitle}>Telejog Premium</Text>
            <Text style={styles.premiumSub}>Unlock animated emojis, 4GB cloud storage & faster downloads.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FFD700" />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={() => setShowLogoutModal(true)}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF4757" style={{ marginRight: 8 }} />
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

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <Modal
          visible={showLogoutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.alertOverlay}>
            <View style={styles.alertCard}>
              <View style={styles.alertIconBox}>
                <Ionicons name="log-out-outline" size={34} color="#FF4757" />
              </View>
              <Text style={styles.alertTitle}>Log Out of Telejog?</Text>
              <Text style={styles.alertSub}>
                Are you sure you want to log out? You can easily log back in using your phone number anytime.
              </Text>

              <View style={styles.alertButtonsRow}>
                <TouchableOpacity
                  style={styles.alertCancelBtn}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.alertCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.alertConfirmBtn}
                  onPress={handleConfirmLogout}
                >
                  <Text style={styles.alertConfirmText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
                  <Text style={styles.chooseAvatarLabel}>Select Avatar</Text>
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
                      placeholderTextColor="#5E6F85"
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
                        placeholderTextColor="#5E6F85"
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
                      placeholderTextColor="#5E6F85"
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
                      placeholder="Bio description"
                      placeholderTextColor="#5E6F85"
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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  topBar: {
    height: 54,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  topBarTitle: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  editHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 212, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editHeaderBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  avatarGlowWrapper: {
    position: 'relative',
    padding: 3,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primaryViolet,
    shadowColor: Colors.primaryViolet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surfaceCard,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: Colors.surface,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  nameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  handleText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 212, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 212, 0.3)',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.online,
    marginRight: 6,
  },
  statusText: {
    color: Colors.online,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardContainer: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.16)',
    overflow: 'hidden',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  infoContent: {
    marginLeft: 14,
    flex: 1,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  infoSub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  menuTitle: {
    color: '#FFF',
    fontSize: 15,
    marginLeft: 14,
    flex: 1,
    fontWeight: '500',
  },
  menuSubTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  deviceBadge: {
    backgroundColor: 'rgba(0, 245, 212, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 212, 0.35)',
  },
  deviceBadgeText: {
    color: Colors.primary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  divider: {
    height: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 64,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#172133',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  premiumIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '800',
  },
  premiumSub: {
    color: '#8B9BB0',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: 'rgba(255, 71, 87, 0.12)',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.25)',
  },
  logoutText: {
    color: '#FF4757',
    fontSize: 15,
    fontWeight: '700',
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: Colors.surfaceCard,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
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
    backgroundColor: '#0B0F17',
  },
  editModalHeader: {
    height: 56,
    backgroundColor: '#0E1420',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  cancelModalBtn: {
    padding: 6,
  },
  cancelModalBtnText: {
    color: '#8B9BB0',
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
    color: Colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  editModalScroll: {
    flex: 1,
  },
  avatarEditContainer: {
    alignItems: 'center',
    paddingVertical: 22,
    backgroundColor: '#0E1420',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  editAvatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 10,
  },
  chooseAvatarLabel: {
    color: '#8B9BB0',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
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
    borderColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editFormCard: {
    backgroundColor: '#141C2B',
    marginTop: 18,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  inputFieldGroup: {
    paddingVertical: 12,
  },
  inputLabel: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  formInput: {
    color: '#FFF',
    fontSize: 15,
    paddingVertical: 4,
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          outlineColor: 'transparent',
          boxShadow: 'none',
        } as any)
      : {}),
  },
  handleInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atPrefix: {
    color: '#8B9BB0',
    fontSize: 16,
    marginRight: 4,
  },
  bioInput: {
    minHeight: 40,
    textAlignVertical: 'top',
  },
  bioCounterText: {
    color: '#5E6F85',
    fontSize: 11,
  },
  fieldDivider: {
    height: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  saveProfileLargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  saveProfileLargeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertCard: {
    width: '88%',
    maxWidth: 320,
    backgroundColor: '#141C2B',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  alertIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  alertTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  alertSub: {
    color: '#8B9BB0',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  alertButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  alertCancelBtn: {
    flex: 1,
    backgroundColor: '#1E283E',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  alertCancelText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  alertConfirmBtn: {
    flex: 1,
    backgroundColor: '#FF4757',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  alertConfirmText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});