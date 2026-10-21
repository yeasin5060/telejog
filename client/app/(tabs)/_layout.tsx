import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Dynamic bottom padding calculation ensuring 100% visibility on all Android & iOS devices
  // Accounts for hardware nav bars, software 3-button nav, and gesture home bars
  const bottomPadding = Math.max(
    insets.bottom,
    Platform.OS === 'android' ? 14 : 18
  ) + (Platform.OS === 'android' && insets.bottom === 0 ? 8 : 2);

  const tabHeight = 62 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBg,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 1.5,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          shadowColor: Colors.primaryViolet,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.3,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                size={24}
                color={focused ? Colors.primary : Colors.tabInactive}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={24}
                color={focused ? Colors.primary : Colors.tabInactive}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={24}
                color={focused ? Colors.primary : Colors.tabInactive}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(255, 42, 133, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 133, 0.5)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
});