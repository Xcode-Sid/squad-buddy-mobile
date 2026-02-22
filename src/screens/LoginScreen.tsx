import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Building2, Shield, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import AnimatedPressable from '../components/AnimatedPressable';

const ROLES = [
  { role: 'individual' as const, icon: User, label: 'Individual', desc: 'Book fields, join squads, track stats', color: colors.primary },
  { role: 'business' as const, icon: Building2, label: 'Business', desc: 'Manage fields, track revenue', color: colors.accent },
  { role: 'admin' as const, icon: Shield, label: 'Admin', desc: 'Platform management', color: colors.secondary },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const nav = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.back} onPress={() => nav.goBack()}>
        <ArrowLeft size={20} color={colors.foreground} />
      </TouchableOpacity>

      <View style={styles.container}>
        <Animated.Text entering={FadeInDown.duration(500)} style={styles.title}>Welcome Back</Animated.Text>
        <Animated.Text entering={FadeInDown.duration(500).delay(150)} style={styles.subtitle}>Choose your profile to continue</Animated.Text>

        <View style={styles.roles}>
          {ROLES.map(({ role, icon: Icon, label, desc, color }, index) => (
            <Animated.View key={role} entering={FadeInUp.delay(300 + index * 120).springify()}>
              <AnimatedPressable
                style={styles.roleCard}
                onPress={() => login(role)}
              >
                <View style={[styles.iconBox, { backgroundColor: color + '1A' }]}>
                  <Icon size={24} color={color} />
                </View>
                <View style={styles.roleText}>
                  <Text style={styles.roleLabel}>{label}</Text>
                  <Text style={styles.roleDesc}>{desc}</Text>
                </View>
              </AnimatedPressable>
            </Animated.View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  back: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: colors.muted,
    alignItems: 'center', justifyContent: 'center', margin: 16,
  },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: colors.foreground, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.mutedForeground, marginBottom: 32 },
  roles: { gap: 12 },
  roleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: colors.card, borderRadius: 16, borderWidth: 1,
    borderColor: colors.border, padding: 16,
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  roleText: { flex: 1 },
  roleLabel: { fontSize: 16, fontWeight: '700', color: colors.foreground },
  roleDesc: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
});
