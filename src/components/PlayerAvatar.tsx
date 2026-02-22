import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  uri: string;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
}

const SIZES = { sm: 32, md: 40, lg: 56 };

export default function PlayerAvatar({ uri, size = 'md', name }: Props) {
  const s = SIZES[size];

  if (!uri && name) {
    return (
      <View style={[styles.fallback, { width: s, height: s, borderRadius: s / 2 }]}>
        <Text style={[styles.initial, { fontSize: s * 0.4 }]}>{name.charAt(0)}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: colors.muted }}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: colors.primary,
    fontWeight: '700',
  },
});
