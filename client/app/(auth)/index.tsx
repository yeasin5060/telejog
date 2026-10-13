import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function AuthScreen() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const router = useRouter();

  const handleNext = () => {
    if (step === 'phone') {
      if (phoneNumber.length >= 8) {
        setStep('otp');
      }
    } else {
      // Complete Auth
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Telejog Logo & Header */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="paper-plane" size={44} color="#FFF" style={{ marginLeft: -3, marginTop: 2 }} />
          </View>
          <Text style={styles.appName}>Telejog</Text>
          <Text style={styles.subTitle}>
            {step === 'phone'
              ? 'Please confirm your country code and enter your phone number.'
              : `We've sent an SMS with an activation code to +880 ${phoneNumber}`}
          </Text>
        </View>

        {/* Input Form */}
        {step === 'phone' ? (
          <View style={styles.form}>
            <TouchableOpacity style={styles.countryPicker}>
              <Text style={styles.countryText}>🇧🇩 Bangladesh (+880)</Text>
              <Ionicons name="chevron-down" size={18} color="#7F91A4" />
            </TouchableOpacity>

            <View style={styles.inputBox}>
              <Text style={styles.prefix}>+880</Text>
              <TextInput
                placeholder="Phone number"
                placeholderTextColor="#7F91A4"
                keyboardType="phone-pad"
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Code"
                placeholderTextColor="#7F91A4"
                keyboardType="number-pad"
                style={[styles.input, { textAlign: 'center', letterSpacing: 8, fontSize: 24 }]}
                maxLength={5}
                value={otpCode}
                onChangeText={setOtpCode}
                autoFocus
              />
            </View>

            <TouchableOpacity onPress={() => setStep('phone')} style={styles.changeNumBtn}>
              <Text style={styles.changeNumText}>Wrong number?</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Ionicons name="arrow-forward" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          By continuing, you agree to Telejog's Privacy Policy & Terms of Service.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#17212B',
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
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2AABEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2AABEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  appName: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subTitle: {
    color: '#7F91A4',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  form: {
    width: '100%',
    marginBottom: 40,
  },
  countryPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#242F3D',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  countryText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242F3D',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 10,
  },
  prefix: {
    color: '#2AABEE',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  changeNumBtn: {
    marginTop: 12,
    alignSelf: 'center',
  },
  changeNumText: {
    color: '#2AABEE',
    fontSize: 14,
    fontWeight: '600',
  },
  continueBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2AABEE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#2AABEE',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  footerNote: {
    color: '#4E5D6E',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
  },
});
