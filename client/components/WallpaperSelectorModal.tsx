import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export interface ChatWallpaper {
  id: string;
  name: string;
  category: string;
  backgroundColor: string;
  accentColor: string;
  sentBubbleColor: string;
  receivedBubbleColor: string;
  borderColor?: string;
  hasPattern?: boolean;
}

export const WALLPAPER_PRESETS: ChatWallpaper[] = [
  {
    id: 'telejog-obsidian',
    name: 'Telejog Obsidian',
    category: 'Default Brand',
    backgroundColor: '#07080D',
    accentColor: '#FF2A85',
    sentBubbleColor: '#8B124B',
    receivedBubbleColor: '#151824',
    borderColor: '#FF2A85',
  },
  {
    id: 'neon-dragonfruit',
    name: 'Dragonfruit Glow',
    category: 'Vibrant',
    backgroundColor: '#16020F',
    accentColor: '#FF2A85',
    sentBubbleColor: '#9C0D50',
    receivedBubbleColor: '#24091A',
    borderColor: '#FF2A85',
  },
  {
    id: 'cyber-mint',
    name: 'Cyber Mint Aurora',
    category: 'Futuristic',
    backgroundColor: '#021410',
    accentColor: '#00F5D4',
    sentBubbleColor: '#006D5E',
    receivedBubbleColor: '#0B211B',
    borderColor: '#00F5D4',
  },
  {
    id: 'midnight-nebula',
    name: 'Midnight Nebula',
    category: 'Cosmic',
    backgroundColor: '#0B0720',
    accentColor: '#A855F7',
    sentBubbleColor: '#581C87',
    receivedBubbleColor: '#171131',
    borderColor: '#A855F7',
  },
  {
    id: 'solar-eclipse',
    name: 'Solar Eclipse',
    category: 'Warm Glow',
    backgroundColor: '#180B03',
    accentColor: '#FF8A00',
    sentBubbleColor: '#8C3D00',
    receivedBubbleColor: '#26160C',
    borderColor: '#FF8A00',
  },
  {
    id: 'royal-emerald',
    name: 'Royal Emerald',
    category: 'Elegance',
    backgroundColor: '#03160D',
    accentColor: '#10B981',
    sentBubbleColor: '#065F46',
    receivedBubbleColor: '#0D2418',
    borderColor: '#10B981',
  },
  {
    id: 'electric-sapphire',
    name: 'Electric Sapphire',
    category: 'Deep Blue',
    backgroundColor: '#050E24',
    accentColor: '#38BDF8',
    sentBubbleColor: '#0369A1',
    receivedBubbleColor: '#0F1A34',
    borderColor: '#38BDF8',
  },
  {
    id: 'stealth-carbon',
    name: 'Stealth Carbon',
    category: 'Minimalist',
    backgroundColor: '#0F1116',
    accentColor: '#94A3B8',
    sentBubbleColor: '#334155',
    receivedBubbleColor: '#1E232B',
    borderColor: '#64748B',
  },
  {
    id: 'doodle-matrix',
    name: 'Tech Doodle Matrix',
    category: 'Pattern',
    backgroundColor: '#0A0D14',
    accentColor: '#00F5D4',
    sentBubbleColor: '#1A2338',
    receivedBubbleColor: '#141822',
    borderColor: '#00F5D4',
    hasPattern: true,
  },
];

interface Props {
  visible: boolean;
  activeWallpaperId: string;
  onSelectWallpaper: (wallpaper: ChatWallpaper) => void;
  onClose: () => void;
}

export default function WallpaperSelectorModal({
  visible,
  activeWallpaperId,
  onSelectWallpaper,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Chat Wallpaper & Theme</Text>
              <Text style={styles.subtitle}>Select a background theme for this chat</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Wallpaper Grid */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.grid}>
              {WALLPAPER_PRESETS.map((item) => {
                const isSelected = item.id === activeWallpaperId;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.card,
                      isSelected && {
                        borderColor: item.accentColor,
                        shadowColor: item.accentColor,
                        shadowOpacity: 0.45,
                        elevation: 6,
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => onSelectWallpaper(item)}
                  >
                    {/* Realistic Chat Miniature Preview */}
                    <View
                      style={[
                        styles.previewBox,
                        { backgroundColor: item.backgroundColor },
                        item.hasPattern && styles.patternOverlay,
                      ]}
                    >
                      {/* Received Mini Bubble */}
                      <View
                        style={[
                          styles.miniBubbleReceived,
                          { backgroundColor: item.receivedBubbleColor },
                        ]}
                      >
                        <View style={styles.miniBubbleLine1} />
                        <View style={styles.miniBubbleLine2} />
                      </View>

                      {/* Sent Mini Bubble */}
                      <View
                        style={[
                          styles.miniBubbleSent,
                          { backgroundColor: item.sentBubbleColor },
                        ]}
                      >
                        <View style={styles.miniBubbleLineSent} />
                      </View>

                      {/* Selected Badge */}
                      {isSelected && (
                        <View
                          style={[
                            styles.selectedCheckBadge,
                            { backgroundColor: item.accentColor },
                          ]}
                        >
                          <Ionicons name="checkmark" size={14} color="#000" />
                        </View>
                      )}
                    </View>

                    {/* Card Title & Category */}
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={[styles.cardCategory, { color: item.accentColor }]}>
                        {item.category}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneBtn}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <Text style={styles.doneBtnText}>Apply Wallpaper</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#111420',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 42, 133, 0.3)',
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#8B9BB0',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 48) / 2,
    backgroundColor: '#151928',
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  previewBox: {
    height: 120,
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    position: 'relative',
  },
  patternOverlay: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 212, 0.2)',
  },
  miniBubbleReceived: {
    width: '70%',
    padding: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  miniBubbleLine1: {
    width: '90%',
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 3,
    marginBottom: 3,
  },
  miniBubbleLine2: {
    width: '55%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
  },
  miniBubbleSent: {
    width: '65%',
    padding: 6,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  miniBubbleLineSent: {
    width: '85%',
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 3,
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  cardInfo: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#131622',
  },
  cardName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cardCategory: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  doneBtn: {
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
