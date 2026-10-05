import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.onSurfaceVariant,
      tabBarStyle: {
        backgroundColor: Colors.surfaceLowest,
        borderTopColor: Colors.surfaceHigh,
        borderTopWidth: 1,
        height: 80,
        paddingBottom: 12,
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: '600',
      },
    }}>
      <Tabs.Screen name="index" options={{
        title : "message",
        tabBarIcon : ({color , focused}) => (
          <Ionicons name = {focused ? "chatbubbles" : "chatbubbles-outline"} size={24} color={color} />
        )
      }}/>
      <Tabs.Screen name="search" options={{
        title : "search",
        tabBarIcon : ({color , focused}) => (
          <Ionicons name = {focused ? "search" : "search-outline"} size={24} color={color} />
        )
      }}/>
      <Tabs.Screen name="profile" options={{
        title : "profile",
        tabBarIcon : ({color , focused}) => (
          <Ionicons name = {focused ? "person" : "person-outline"} size={24} color={color} />
        )
      }}/>
    </Tabs>
  )
}