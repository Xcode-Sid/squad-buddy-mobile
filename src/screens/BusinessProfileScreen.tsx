import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle, Pencil, LogOut } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { useAuth } from '../context/AuthContext';
import type { BusinessProfile } from '../types/auth';

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

export default function BusinessProfileScreen() {
  const { user, logout } = useAuth();
  const biz = user?.role === 'business' ? (user as BusinessProfile) : null;

  const handleEdit = () => {
  };

  if (!biz) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Business Profile</Text>
          <Text style={styles.emptyText}>Business account required</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <View style={styles.titleRow}>
          <Text style={styles.title}>{biz.businessName}</Text>
          {biz.verified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle size={18} color={colors.primary} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>Business profile</Text>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.card}>
          <FieldRow label="Business Name" value={biz.businessName} />
          <FieldRow label="Description" value={biz.description} />
          <FieldRow label="Address" value={biz.address} />
          <FieldRow label="City" value={biz.city} />
          <FieldRow label="Phone" value={biz.phone} />
          <FieldRow label="Email" value={biz.email} />
        </Animated.View>

        <Animated.View entering={FadeInUp.springify().delay(200).duration(500)}>
          <AnimatedPressable style={styles.editBtn} onPress={handleEdit}>
            <Pencil size={18} color={colors.primaryForeground} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </AnimatedPressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.springify().delay(280).duration(500)}>
          <AnimatedPressable
            style={styles.logoutBtn}
            onPress={logout}
          >
            <LogOut size={18} color={colors.destructive} />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </AnimatedPressable>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 20,
  },
  fieldRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fieldLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: colors.foreground,
    fontWeight: '500',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  editBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.destructive + '15',
    borderWidth: 1,
    borderColor: colors.destructive + '40',
    marginTop: 12,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.destructive,
  },
  bottomSpacer: {
    height: 24,
  },
});
