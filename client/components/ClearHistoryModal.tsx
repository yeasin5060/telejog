import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface Props {
  visible: boolean;
  participantName: string;
  onConfirm: (alsoForFriend: boolean) => void;
  onClose: () => void;
}

export default function ClearHistoryModal({
  visible,
  participantName,
  onConfirm,
  onClose,
}: Props) {
  const [alsoForFriend, setAlsoForFriend] = useState(true);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialogBox}>
          {/* Warning Icon Box */}
          <View style={styles.iconCircle}>
            <Ionicons name="trash" size={28} color="#FF4757" />
          </View>

          {/* Title & Message */}
          <Text style={styles.title}>Clear Chat History?</Text>
          <Text style={styles.description}>
            Are you sure you want to clear the messages in this chat? This action cannot be undone.
          </Text>

          {/* Checkbox: Also clear for friend */}
          <TouchableOpacity
            style={styles.checkboxRow}
            activeOpacity={0.8}
            onPress={() => setAlsoForFriend(!alsoForFriend)}
          >
            <View style={[styles.checkbox, alsoForFriend && styles.checkboxActive]}>
              {alsoForFriend && <Ionicons name="checkmark" size={15} color="#FFF" />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.checkboxLabel}>
                Also clear for {participantName}
              </Text>
              <Text style={styles.checkboxSub}>
                Delete all messages from both your device and {participantName}'s device
              </Text>
            </View>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearBtn}
              activeOpacity={0.85}
              onPress={() => onConfirm(alsoForFriend)}
            >
              <Ionicons name="trash-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.clearBtnText}>Clear History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#111420',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.25)',
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 12,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 71, 87, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 71, 87, 0.3)',
  },
  title: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    color: '#8B9BB0',
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B2A',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 20,
    width: '100%',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: '#5E6F85',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  checkboxSub: {
    color: '#8B9BB0',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14,
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#1A2132',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#8B9BB0',
    fontSize: 14.5,
    fontWeight: '600',
  },
  clearBtn: {
    flex: 1.2,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FF4757',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  clearBtnText: {
    color: '#FFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
