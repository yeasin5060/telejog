import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { dummyDeviceSessions } from '@/assets/assets';
import { DeviceSession } from '@/types';

export default function DevicesScreen() {
  const router = useRouter();

  const [sessions, setSessions] = useState<DeviceSession[]>(dummyDeviceSessions);
  const [selectedSession, setSelectedSession] = useState<DeviceSession | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTerminateAllModal, setShowTerminateAllModal] = useState(false);
  const [autoTerminatePeriod, setAutoTerminatePeriod] = useState<string>('3 months');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const currentDevice = sessions.find((s) => s.isCurrent) || sessions[0];
  const otherSessions = sessions.filter((s) => !s.isCurrent);

  // Terminate a single session
  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setSelectedSession(null);
    showToast('Session terminated successfully');
  };

  // Terminate all other sessions
  const handleTerminateAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setShowTerminateAllModal(false);
    showToast('All other sessions terminated');
  };

  // Simulate scanning QR and adding desktop session
  const handleLinkNewDesktop = () => {
    const newDesktopSession: DeviceSession = {
      id: `dev_desktop_${Date.now()}`,
      deviceName: 'Telejog Web (Edge Browser)',
      deviceType: 'browser',
      platform: 'Windows 11',
      appName: 'Telejog Web Client v3.2',
      ipAddress: '103.147.218.42',
      location: 'Dhaka, Bangladesh',
      lastActive: 'Just now',
      isCurrent: false,
    };
    setSessions((prev) => [currentDevice, newDesktopSession, ...otherSessions]);
    setShowQRModal(false);
    showToast('New desktop device linked successfully! 💻');
  };

  const getDeviceIcon = (type: DeviceSession['deviceType']) => {
    switch (type) {
      case 'desktop':
        return 'laptop-outline';
      case 'browser':
        return 'globe-outline';
      case 'tablet':
        return 'tablet-portrait-outline';
      case 'mobile':
      default:
        return 'phone-portrait-outline';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Devices</Text>
        <TouchableOpacity
          style={styles.qrScanBtn}
          onPress={() => setShowQRModal(true)}
        >
          <Ionicons name="qr-code-outline" size={22} color="#2AABEE" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Link Desktop Device Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconBox}>
            <MaterialCommunityIcons name="laptop-account" size={48} color="#2AABEE" />
          </View>
          <Text style={styles.heroTitle}>Link Telejog Desktop</Text>
          <Text style={styles.heroSub}>
            Scan the QR code displayed on Telejog Web or Desktop to sync messages seamlessly across all screens.
          </Text>

          <TouchableOpacity
            style={styles.linkDesktopBtn}
            activeOpacity={0.85}
            onPress={() => setShowQRModal(true)}
          >
            <Ionicons name="qr-code" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.linkDesktopBtnText}>Link Desktop Device</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 1: THIS DEVICE (CURRENT SESSION) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>THIS DEVICE</Text>
          <View style={styles.card}>
            <View style={styles.deviceRow}>
              <View style={styles.deviceIconWrapperCurrent}>
                <Ionicons
                  name={getDeviceIcon(currentDevice.deviceType) as any}
                  size={24}
                  color="#2AABEE"
                />
              </View>

              <View style={styles.deviceInfo}>
                <View style={styles.deviceNameRow}>
                  <Text style={styles.deviceName}>{currentDevice.deviceName}</Text>
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>Current</Text>
                  </View>
                </View>
                <Text style={styles.deviceSub}>{currentDevice.appName}</Text>
                <Text style={styles.deviceMeta}>
                  {currentDevice.location} · {currentDevice.ipAddress}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* TERMINATE ALL OTHER SESSIONS BUTTON */}
        {otherSessions.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <TouchableOpacity
              style={styles.terminateAllBtn}
              activeOpacity={0.8}
              onPress={() => setShowTerminateAllModal(true)}
            >
              <Ionicons name="power-outline" size={18} color="#E53935" style={{ marginRight: 8 }} />
              <Text style={styles.terminateAllText}>Terminate All Other Sessions</Text>
            </TouchableOpacity>
            <Text style={styles.terminateAllHelp}>
              Logs out all other devices except this current phone.
            </Text>
          </View>
        )}

        {/* SECTION 2: ACTIVE SESSIONS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>ACTIVE SESSIONS</Text>
            <Text style={styles.sessionCountBadge}>{otherSessions.length}</Text>
          </View>

          {otherSessions.length === 0 ? (
            <View style={styles.cardEmpty}>
              <Ionicons name="checkmark-circle-outline" size={32} color="#2AABEE" />
              <Text style={styles.emptyTitle}>No other active sessions</Text>
              <Text style={styles.emptySub}>
                You are only logged in on this mobile device.
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              {otherSessions.map((session, index) => (
                <React.Fragment key={session.id}>
                  <TouchableOpacity
                    style={styles.deviceRow}
                    activeOpacity={0.7}
                    onPress={() => setSelectedSession(session)}
                  >
                    <View style={styles.deviceIconWrapper}>
                      <Ionicons
                        name={getDeviceIcon(session.deviceType) as any}
                        size={22}
                        color="#7F91A4"
                      />
                    </View>

                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceName}>{session.deviceName}</Text>
                      <Text style={styles.deviceSub}>
                        {session.appName} ({session.platform})
                      </Text>
                      <Text style={styles.deviceMeta}>
                        {session.location} · {session.lastActive}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.disconnectItemBtn}
                      onPress={() => handleTerminateSession(session.id)}
                    >
                      <Ionicons name="close-circle-outline" size={20} color="#E53935" />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {index < otherSessions.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        {/* SECTION 3: AUTOMATICALLY TERMINATE OLD SESSIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>AUTOMATIC TERMINATION</Text>
          <View style={styles.card}>
            <View style={{ padding: 14 }}>
              <Text style={styles.autoTerminateTitle}>If inactive for</Text>
              <Text style={styles.autoTerminateSub}>
                Sessions that remain inactive will be logged out automatically.
              </Text>

              <View style={styles.periodPillRow}>
                {['1 week', '1 month', '3 months', '6 months', '1 year'].map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.periodPill,
                      autoTerminatePeriod === period && styles.periodPillActive,
                    ]}
                    onPress={() => {
                      setAutoTerminatePeriod(period);
                      showToast(`Auto-termination updated to ${period}`);
                    }}
                  >
                    <Text
                      style={[
                        styles.periodPillText,
                        autoTerminatePeriod === period && styles.periodPillTextActive,
                      ]}
                    >
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* MODAL 1: LINK DESKTOP QR CODE SIMULATION */}
      {showQRModal && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setShowQRModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.qrModalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Scan QR Code</Text>
                <TouchableOpacity onPress={() => setShowQRModal(false)} style={styles.closeModalBtn}>
                  <Ionicons name="close" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.qrInstructions}>
                1. Open <Text style={{ color: '#2AABEE', fontWeight: 'bold' }}>web.telejog.org</Text> or Telejog Desktop app on your computer.
                {'\n'}2. Point your camera at the QR code on the screen.
              </Text>

              {/* QR Scanner Frame Simulation */}
              <View style={styles.qrFrameContainer}>
                <View style={styles.qrFrameBox}>
                  <Ionicons name="qr-code" size={170} color="#2AABEE" />
                  <View style={styles.qrScannerBar} />
                </View>
                <Text style={styles.qrScanningText}>Camera active · Scanning...</Text>
              </View>

              <TouchableOpacity
                style={styles.confirmScanBtn}
                activeOpacity={0.85}
                onPress={handleLinkNewDesktop}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.confirmScanText}>Simulate Link Device</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* MODAL 2: SESSION DETAILS MODAL */}
      {selectedSession && (
        <Modal
          visible={!!selectedSession}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedSession(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.sessionDetailCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Device Details</Text>
                <TouchableOpacity onPress={() => setSelectedSession(null)}>
                  <Ionicons name="close" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.detailIconRow}>
                <View style={styles.detailIconWrapper}>
                  <Ionicons
                    name={getDeviceIcon(selectedSession.deviceType) as any}
                    size={32}
                    color="#2AABEE"
                  />
                </View>
                <View style={{ marginLeft: 14 }}>
                  <Text style={styles.detailDeviceName}>{selectedSession.deviceName}</Text>
                  <Text style={styles.detailPlatform}>{selectedSession.platform}</Text>
                </View>
              </View>

              <View style={styles.detailFieldsBox}>
                <View style={styles.detailField}>
                  <Text style={styles.detailFieldLabel}>Application</Text>
                  <Text style={styles.detailFieldValue}>{selectedSession.appName}</Text>
                </View>
                <View style={styles.detailField}>
                  <Text style={styles.detailFieldLabel}>IP Address</Text>
                  <Text style={styles.detailFieldValue}>{selectedSession.ipAddress}</Text>
                </View>
                <View style={styles.detailField}>
                  <Text style={styles.detailFieldLabel}>Location</Text>
                  <Text style={styles.detailFieldValue}>{selectedSession.location}</Text>
                </View>
                <View style={styles.detailField}>
                  <Text style={styles.detailFieldLabel}>Last Active</Text>
                  <Text style={styles.detailFieldValue}>{selectedSession.lastActive}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.terminateSingleBtn}
                onPress={() => handleTerminateSession(selectedSession.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#E53935" style={{ marginRight: 6 }} />
                <Text style={styles.terminateSingleText}>Terminate Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* MODAL 3: CONFIRM TERMINATE ALL OTHER SESSIONS */}
      {showTerminateAllModal && (
        <Modal
          visible={showTerminateAllModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTerminateAllModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.alertCard}>
              <View style={styles.alertIconBox}>
                <Ionicons name="warning-outline" size={36} color="#E53935" />
              </View>
              <Text style={styles.alertTitle}>Terminate all other sessions?</Text>
              <Text style={styles.alertSub}>
                Are you sure you want to log out from {otherSessions.length} active sessions? You will need to log in again on those devices.
              </Text>

              <View style={styles.alertButtonsRow}>
                <TouchableOpacity
                  style={styles.alertCancelBtn}
                  onPress={() => setShowTerminateAllModal(false)}
                >
                  <Text style={styles.alertCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.alertConfirmBtn}
                  onPress={handleTerminateAllOtherSessions}
                >
                  <Text style={styles.alertConfirmText}>Terminate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  header: {
    height: 56,
    backgroundColor: '#17212B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#101721',
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    flex: 1,
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  qrScanBtn: {
    padding: 6,
  },
  container: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: '#17212B',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22303E',
  },
  heroIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(42, 171, 238, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  heroSub: {
    color: '#7F91A4',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  linkDesktopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2AABEE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#2AABEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  linkDesktopBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 18,
  },
  sectionHeader: {
    color: '#2AABEE',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sessionCountBadge: {
    backgroundColor: '#242F3D',
    color: '#2AABEE',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#17212B',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#101721',
  },
  cardEmpty: {
    backgroundColor: '#17212B',
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#101721',
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySub: {
    color: '#7F91A4',
    fontSize: 12,
    marginTop: 2,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  deviceIconWrapperCurrent: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(42, 171, 238, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#242F3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 14,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  onlineText: {
    color: '#4CAF50',
    fontSize: 11,
    fontWeight: 'bold',
  },
  deviceSub: {
    color: '#A2B0BF',
    fontSize: 13,
    marginTop: 2,
  },
  deviceMeta: {
    color: '#657786',
    fontSize: 12,
    marginTop: 2,
  },
  disconnectItemBtn: {
    padding: 8,
  },
  divider: {
    height: 0.6,
    backgroundColor: '#22303E',
    marginLeft: 74,
  },
  terminateAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229, 57, 53, 0.12)',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.25)',
  },
  terminateAllText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: 'bold',
  },
  terminateAllHelp: {
    color: '#657786',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  autoTerminateTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  autoTerminateSub: {
    color: '#7F91A4',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  periodPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodPill: {
    backgroundColor: '#242F3D',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  periodPillActive: {
    backgroundColor: 'rgba(42, 171, 238, 0.2)',
    borderColor: '#2AABEE',
  },
  periodPillText: {
    color: '#7F91A4',
    fontSize: 13,
    fontWeight: '500',
  },
  periodPillTextActive: {
    color: '#2AABEE',
    fontWeight: 'bold',
  },
  toastContainer: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    backgroundColor: 'rgba(23, 33, 43, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2AABEE',
    zIndex: 999,
  },
  toastText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrModalSheet: {
    width: '94%',
    maxWidth: 360,
    backgroundColor: '#17212B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#243242',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeModalBtn: {
    padding: 4,
  },
  qrInstructions: {
    color: '#A2B0BF',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  qrFrameContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  qrFrameBox: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#0E1621',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2AABEE',
    position: 'relative',
    overflow: 'hidden',
  },
  qrScannerBar: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#2AABEE',
    top: '50%',
    shadowColor: '#2AABEE',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  qrScanningText: {
    color: '#40A7E3',
    fontSize: 12,
    marginTop: 8,
  },
  confirmScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2AABEE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 22,
    marginTop: 18,
  },
  confirmScanText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sessionDetailCard: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: '#17212B',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#243242',
  },
  detailIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(42, 171, 238, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailDeviceName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailPlatform: {
    color: '#7F91A4',
    fontSize: 13,
  },
  detailFieldsBox: {
    backgroundColor: '#0E1621',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  detailField: {
    marginVertical: 4,
  },
  detailFieldLabel: {
    color: '#657786',
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailFieldValue: {
    color: '#FFF',
    fontSize: 13,
    marginTop: 1,
  },
  terminateSingleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229, 57, 53, 0.12)',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.3)',
  },
  terminateSingleText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: 'bold',
  },
  alertCard: {
    width: '88%',
    maxWidth: 320,
    backgroundColor: '#17212B',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#243242',
  },
  alertIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 57, 53, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  alertSub: {
    color: '#A2B0BF',
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
    backgroundColor: '#242F3D',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  alertCancelText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  alertConfirmBtn: {
    flex: 1,
    backgroundColor: '#E53935',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  alertConfirmText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
