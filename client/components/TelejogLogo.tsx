import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface Props {
  size?: number;
  glow?: boolean;
}

export default function TelejogLogo({ size = 32, glow = true }: Props) {
  const containerSize = size;
  const borderRadius = Math.round(size * 0.24);

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius,
        },
        glow && styles.glow,
      ]}
    >
      <Image
        source={require('@/assets/images/telejog-logo.png')}
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius,
        }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#07080D',
  },
  glow: {
    shadowColor: '#FF2A85',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
});
