import { KeyboardAvoidingView, Platform, ScrollView, View, Text , TouchableOpacity, ActivityIndicator ,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/Colors';
import { styles } from '@/assets/styles/AuthScreen.styles';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import {SvgXml} from 'react-native-svg'
import { TextInput } from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons'

type Mode = 'login' | 'register';

export default function AuthScreen() {

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerifying(true);
    }, 2000);
  }

  const handleVerify = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 2000);
  }
   
  const svgMarkup = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M54 0c5.523 0 10 4.477 10 10v44c0 5.523-4.477 10-10 10H37.871C35.368 46.753 41.8 29.002 55.437 17.423a52 52 0 0 0-8.057 3.847C31.593 30.553 22.59 46.956 22.043 64H10c-1.127 0-2.21-.19-3.222-.533-.18-3.525.037-7.127.692-10.75 4.105-22.71 23.963-38.605 46.276-38.46a47 47 0 0 0-7.84-2.128C27.81 8.858 10.266 16.473 0 30.304V10C0 4.477 4.477 0 10 0z" fill="#4f39f6"/></svg> `

  if(verifying) {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* logo */}
            <View style={styles.logoRow}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryContainer]}
                style={styles.logoBox}>
                  <SvgXml xml={svgMarkup} width="50%" height="50%" />
                </LinearGradient>
                <Text style={styles.appName}>teleJog</Text>
            </View>
            {/* Hero text*/}
            <Text style={styles.heading}>
              verify your email
            </Text>
            <Text style={styles.subheading}>
              We have sent 6 digit verification code to your {email}. Please enter the code below to verify your account.
            </Text>
            <View style={styles.form}>
              
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Verification Code</Text>
                <TextInput style = {styles.input} value={verificationCode} onChangeText={setVerificationCode} placeholder="Enter 6-digit code" placeholderTextColor={Colors.outlineVariant} autoCapitalize='none' keyboardType='number-pad' />
              </View>

                {/* Back to sign up link */}
              <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>
                  Did not receive the code?
                </Text>
                <TouchableOpacity onPress = {() => setVerifying(false)}>
                  <Text style={styles.toggleLink}>Go Back</Text>
                </TouchableOpacity>
              </View>
              {/*Submit Button*/}
              <TouchableOpacity onPress={handleVerify} disabled = {loading} activeOpacity={0.88} style={styles.btnWrapper} >
                <LinearGradient colors={[Colors.primary, Colors.primaryContainer]} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.onPrimary}  />
                  ) : (
                    <>
                      <Text style = {styles.btnText}>Verify Code</Text>
                      <Ionicons name = "arrow-forward" size={18} color={Colors.onPrimary} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* logo */}
          <View style={styles.logoRow}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryContainer]}
              style={styles.logoBox}>
                <SvgXml xml={svgMarkup} width="50%" height="50%" />
              </LinearGradient>
              <Text style={styles.appName}>teleJog</Text>
          </View>
          {/* Hero text*/}
          <Text style={styles.heading}>
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </Text>
          <Text style={styles.subheading}>
            {mode === 'login' ? 'sign in to continue chatting' : 'Fill in your details to get started'}
          </Text>
          <View style={styles.form}>
            {mode === 'register' && (
              <>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <TextInput style = {styles.input} value={name} onChangeText={setName} placeholder="Enter your full name" placeholderTextColor={Colors.outlineVariant} autoCapitalize='words' />
                </View>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Username Handle</Text>
                  <View style = {styles.handleRow}>
                    <Text style = {styles.atSign}>@</Text>
                    <TextInput style = {[styles.input, styles.handleInput]} value={handle} onChangeText={(v) => setHandle(v.toLowerCase().replace(/\s/g, ''))} placeholder="Enter your username" placeholderTextColor={Colors.outlineVariant} autoCapitalize='none' />
                  </View>
                </View>
              </>
            )}
             <View style={styles.field}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput style = {styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" placeholderTextColor={Colors.outlineVariant} autoCapitalize='none' keyboardType='email-address' />
              </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput style = {styles.input} value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor={Colors.outlineVariant} secureTextEntry />
            </View>
            {/*Toggle Method*/}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleText}>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
                <Text style={styles.toggleLink}>
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
            {/*Submit Button*/}
            <TouchableOpacity onPress={handleSubmit} disabled = {loading} activeOpacity={0.88} style={styles.btnWrapper} >
              <LinearGradient colors={[Colors.primary, Colors.primaryContainer]} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.onPrimary}  />
                ) : (
                  <>
                    <Text style = {styles.btnText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
                    <Ionicons name = "arrow-forward" size={18} color={Colors.onPrimary} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
