import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Conversation, UserStory } from '@/types'
import { useRouter } from 'expo-router';
import { dummyConversationData } from '@/assets/assets';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MessageScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search , setSearch] = useState('');
  const [loading , setLoading] = useState(false);
  const [selectedStory , setSelectedStory] = useState<UserStory | null>(null);

  const router = useRouter();

  const featherConversations = async () => {
    setLoading(true);
    setTimeout(() => {
      setConversations(dummyConversationData as any);
      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    featherConversations();
  }, []);

  return (
    <SafeAreaView>
      
    </SafeAreaView>
  )
}