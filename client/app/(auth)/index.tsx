import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';

export default function AuthScreen() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleNext = () => {
    if (step === 'phone') {
      if (phoneNumber.length >= 8) {
        setStep('otp');
      }
    } else {
      // Complete Auth via Redux Toolkit
      dispatch(
        login({
          token: `telejog_token_${Date.now()}`,
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      >
        <View style={styles.container}>
          {/* Telejog Glowing Logo & Header */}
          <View style={styles.logoContainer}>
            <View style={styles.iconCircleGlow}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="paper-plane"
                  size={46}
                  color="#FFF"
                  style={{ marginLeft: -3, marginTop: 2 }}
                />
              </View>
            </View>
            <Text style={styles.appName}>Telejog</Text>
            <Text style={styles.subTitle}>
              {step === 'phone'
                ? 'The world’s fastest messaging app. It is free and secure.'
                : `We've sent an SMS with an activation code to +880 ${phoneNumber}`}
            </Text>
          </View>

          {/* Input Form */}
          {step === 'phone' ? (
            <View style={styles.form}>
              <TouchableOpacity style={styles.countryPicker} activeOpacity={0.8}>
                <Text style={styles.countryText}>🇧🇩 Bangladesh (+880)</Text>
                <Ionicons name="chevron-down" size={18} color="#8B9BB0" />
              </TouchableOpacity>

              <View style={styles.inputBox}>
                <Text style={styles.prefix}>+880</Text>
                <TextInput
                  placeholder="Phone number"
                  placeholderTextColor="#5E6F85"
                  keyboardType="phone-pad"
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  autoFocus
                />
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="00000"
                  placeholderTextColor="#5E6F85"
                  keyboardType="number-pad"
                  style={[
                    styles.input,
                    { textAlign: 'center', letterSpacing: 10, fontSize: 26, fontWeight: 'bold' },
                  ]}
                  maxLength={5}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                onPress={() => setStep('phone')}
                style={styles.changeNumBtn}
              >
                <Text style={styles.changeNumText}>Wrong number? Tap to change</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Glowing Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueBtn,
              (step === 'phone' ? phoneNumber.length < 8 : otpCode.length < 3) &&
                styles.continueBtnDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleNext}
          >
            <Ionicons name="arrow-forward" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            By continuing, you agree to Telejog's Privacy Policy & Terms of Service.
          </Text>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  iconCircleGlow: {
    padding: 6,
    borderRadius: 56,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    marginBottom: 16,
  },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.primaryViolet,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryViolet,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  appName: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  subTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 32,
  },
  countryPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.16)',
  },
  countryText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 212, 0.35)',
  },
  prefix: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          outlineColor: 'transparent',
          boxShadow: 'none',
        } as any)
      : {}),
  },
  changeNumBtn: {
    marginTop: 14,
    alignSelf: 'center',
  },
  changeNumText: {
    color: Colors.primary,
    fontSize: 13.5,
    fontWeight: '600',
  },
  continueBtn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.primaryViolet,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primaryViolet,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  footerNote: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 36,
    paddingHorizontal: 20,
    lineHeight: 16,
  },
});
