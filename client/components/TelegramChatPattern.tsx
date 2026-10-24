import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  color?: string;
  opacity?: number;
}

// Iconic Telegram doodle motifs (Plane, Bubble, Coffee, Camera, Cat, Star, Rocket, Heart, Headphones, Planet, Gamepad, Lightbulb)
const DOODLE_DEFS = [
  // 0: Telegram Paper Plane
  (c: string) => (
    <Path
      d="M2.5 12.5L21.5 2.5L13.5 21.5L9.5 14.5L2.5 12.5ZM9.5 14.5L14.5 9.5"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 1: Chat Speech Bubble
  (c: string) => (
    <Path
      d="M3 10C3 5.5 6.5 2 11 2C15.5 2 19 5.5 19 10C19 14.5 15.5 18 11 18C9.5 18 8 17.5 6.8 16.7L3 18L4.2 14.4C3.4 13.1 3 11.6 3 10Z"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 2: Coffee Cup
  (c: string) => (
    <Path
      d="M4 8H16V13.5C16 15.5 14.2 17 12 17H8C5.8 17 4 15.5 4 13.5V8ZM16 9.5H18C19.1 9.5 20 10.4 20 11.5C20 12.6 19.1 13.5 18 13.5H16M7 3.5V5.5M10 2.5V5.5M13 3.5V5.5"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 3: Camera
  (c: string) => (
    <Path
      d="M4 7H7L8.5 4.5H13.5L15 7H18C19.1 7 20 7.9 20 9V17C20 18.1 19.1 19 18 19H4C2.9 19 2 18.1 2 17V9C2 7.9 2.9 7 4 7ZM11 16C13.2 16 15 14.2 15 12C15 9.8 13.2 8 11 8C8.8 8 7 9.8 7 12C7 14.2 8.8 16 11 16Z"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 4: Cute Cat Head
  (c: string) => (
    <Path
      d="M4 6L6.5 11C7.8 10.4 9.4 10 11 10C12.6 10 14.2 10.4 15.5 11L18 6L16.5 13C17.4 14.3 18 15.8 18 17.5C18 20 15 21 11 21C7 21 4 20 4 17.5C4 15.8 4.6 14.3 5.5 13L4 6ZM8 15H8.01M14 15H14.01M11 17L10 18H12L11 17Z"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 5: Sparkling Star
  (c: string) => (
    <Path
      d="M11 2L13.5 7.5L19.5 8.2L15 12.4L16.2 18.3L11 15.2L5.8 18.3L7 12.4L2.5 8.2L8.5 7.5L11 2Z"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 6: Rocket Ship
  (c: string) => (
    <Path
      d="M12 2C9 4 7 8 7 13L4 16V19L8 18L10 20H14L16 18L20 19V16L17 13C17 8 15 4 12 2ZM12 8C12.8 8 13.5 8.7 13.5 9.5C13.5 10.3 12.8 11 12 11C11.2 11 10.5 10.3 10.5 9.5C10.5 8.7 11.2 8 12 8Z"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 7: Heart
  (c: string) => (
    <Path
      d="M11 18.5L9.6 17.2C4.5 12.6 1.2 9.6 1.2 5.9C1.2 2.9 3.5 0.6 6.5 0.6C8.2 0.6 9.8 1.4 11 2.7C12.2 1.4 13.8 0.6 15.5 0.6C18.5 0.6 20.8 2.9 20.8 5.9C20.8 9.6 17.5 12.6 12.4 17.2L11 18.5Z"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 8: Music Headphones
  (c: string) => (
    <Path
      d="M3 13V10C3 5.6 6.6 2 11 2C15.4 2 19 5.6 19 10V13M3 13C3 11.9 3.9 11 5 11H6V17H5C3.9 17 3 16.1 3 15V13ZM19 13C19 11.9 18.1 11 17 11H16V17H17C18.1 17 19 16.1 19 15V13Z"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 9: Planet Saturn
  (c: string) => (
    <Path
      d="M11 5C14.3 5 17 7.7 17 11C17 14.3 14.3 17 11 17C7.7 17 5 14.3 5 11C5 7.7 7.7 5 11 5ZM2 11C2 9 6 7 11 7C16 7 20 9 20 11C20 13 16 15 11 15C6 15 2 13 2 11Z"
      stroke={c}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 10: Game Controller
  (c: string) => (
    <Path
      d="M6 7H16C18.2 7 20 8.8 20 11V14C20 16.8 17.8 19 15 19L13 16H9L7 19C4.2 19 2 16.8 2 14V11C2 8.8 3.8 7 6 7ZM6 10V14M4 12H8M15 11H15.01M17 13H17.01"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  // 11: Lightbulb
  (c: string) => (
    <Path
      d="M7 9C7 6.8 8.8 5 11 5C13.2 5 15 6.8 15 9C15 10.7 13.9 12.2 12.5 12.8V14.5H9.5V12.8C8.1 12.2 7 10.7 7 9ZM9 16.5H13M10 18.5H12"
      stroke={c}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
];

export default function TelegramChatPattern({
  color = '#FFFFFF',
  opacity = 0.065,
}: Props) {
  // Precompute grid items so rendering is instant and pure
  const gridItems = useMemo(() => {
    const colSpacing = 68;
    const rowSpacing = 68;
    const cols = Math.ceil((SCREEN_WIDTH + 100) / colSpacing);
    const rows = Math.ceil((SCREEN_HEIGHT + 200) / rowSpacing);

    const items: Array<{
      key: string;
      x: number;
      y: number;
      rotation: number;
      scale: number;
      doodleIdx: number;
    }> = [];

    let count = 0;
    for (let r = 0; r < rows; r++) {
      const offsetX = (r % 2 === 1) ? colSpacing / 2 : 0;
      for (let c = 0; c < cols; c++) {
        const x = c * colSpacing + offsetX - 15;
        const y = r * rowSpacing - 10;
        const doodleIdx = (r * 5 + c * 3 + count) % DOODLE_DEFS.length;
        const rotation = ((r + c) % 3 === 0) ? -12 : ((r + c) % 3 === 1) ? 14 : 0;
        const scale = 0.95;

        items.push({
          key: `doodle-${r}-${c}`,
          x,
          y,
          rotation,
          scale,
          doodleIdx,
        });
        count++;
      }
    }
    return items;
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg
        width="100%"
        height="100%"
        style={{ opacity }}
      >
        {gridItems.map((item) => (
          <G
            key={item.key}
            transform={`translate(${item.x}, ${item.y}) rotate(${item.rotation}, 11, 11) scale(${item.scale})`}
          >
            {DOODLE_DEFS[item.doodleIdx](color)}
          </G>
        ))}
      </Svg>
    </View>
  );
}
