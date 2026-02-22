import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, Radio, Trophy, LogIn } from 'lucide-react-native';
import { colors } from '../theme/colors';
import AnimatedPressable from '../components/AnimatedPressable';

export default function LandingScreen() {
  const nav = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Animated.Text entering={FadeInDown.duration(600)} style={styles.logo}>Squad Buddy</Animated.Text>
          <Animated.Text entering={FadeInDown.duration(600).delay(200)} style={styles.tagline}>Find fields. Build squads.{'\n'}Play together.</Animated.Text>
        </View>

        <Animated.View entering={FadeInUp.duration(500).delay(400)} style={styles.actions}>
          {[
            { icon: Search, label: 'Explore Fields', onPress: () => nav.navigate('Explore'), color: colors.primary },
            { icon: Radio, label: 'Live Scores', onPress: () => nav.navigate('LiveScores'), color: colors.destructive },
            { icon: Trophy, label: 'Tournaments', onPress: () => nav.navigate('Tournaments'), color: colors.accent },
          ].map(({ icon: Icon, label, onPress, color }, index) => (
            <Animated.View key={label} entering={FadeInUp.delay(500 + index * 100).springify()}>
              <AnimatedPressable style={styles.actionBtn} onPress={onPress}>
                <View style={[styles.actionIcon, { backgroundColor: color + '1A' }]}>
                  <Icon size={20} color={color} />
                </View>
                <Text style={styles.actionLabel}>{label}</Text>
              </AnimatedPressable>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(800).springify()}>
          <AnimatedPressable style={styles.signInBtn} onPress={() => nav.navigate('Login')}>
            <LogIn size={18} color={colors.primaryForeground} />
            <Text style={styles.signInText}>Sign In</Text>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 36, fontWeight: '800', color: colors.primary, marginBottom: 12 },
  tagline: { fontSize: 16, color: colors.mutedForeground, textAlign: 'center', lineHeight: 24 },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 48 },
  actionBtn: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, color: colors.foreground, fontWeight: '500' },
  signInBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 14,
  },
  signInText: { color: colors.primaryForeground, fontSize: 16, fontWeight: '700' },
});
