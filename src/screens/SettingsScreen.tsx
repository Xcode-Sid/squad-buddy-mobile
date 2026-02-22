import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, User, Bell, CreditCard, HelpCircle, LogOut, Clock, Mail } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';

export default function SettingsScreen() {
  const nav = useNavigation<any>();
  const { logout, user } = useAuth();
  const [bookingReminders, setBookingReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSignOut = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <AnimatedPressable
            style={styles.row}
            onPress={() =>
              user?.role === 'business'
                ? nav.navigate('BusinessTabs', { screen: 'BizProfile' })
                : nav.navigate('IndividualTabs', { screen: 'Profile' })
            }
          >
            <User size={20} color={colors.mutedForeground} />
            <Text style={styles.rowText}>Profile</Text>
            <ChevronRight size={18} color={colors.mutedForeground} />
          </AnimatedPressable>
          <AnimatedPressable
            style={[styles.row, styles.rowLast]}
            onPress={() => nav.navigate('Notifications')}
          >
            <Bell size={20} color={colors.mutedForeground} />
            <Text style={styles.rowText}>Notifications</Text>
            <ChevronRight size={18} color={colors.mutedForeground} />
          </AnimatedPressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <AnimatedPressable
            style={[styles.row, styles.rowFirst, styles.rowLast]}
            onPress={() => nav.navigate('Subscription')}
          >
            <CreditCard size={20} color={colors.mutedForeground} />
            <Text style={styles.rowText}>Manage Plan</Text>
            <ChevronRight size={18} color={colors.mutedForeground} />
          </AnimatedPressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <AnimatedPressable
            style={[styles.row, styles.rowFirst, styles.rowLast]}
            onPress={() => nav.navigate('HelpCenter')}
          >
            <HelpCircle size={20} color={colors.mutedForeground} />
            <Text style={styles.rowText}>Help Center</Text>
            <ChevronRight size={18} color={colors.mutedForeground} />
          </AnimatedPressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <View style={[styles.row, styles.rowFirst]}>
            <Clock size={20} color={colors.mutedForeground} />
            <Text style={styles.rowText}>Booking Reminders</Text>
            <Switch
              value={bookingReminders}
              onValueChange={setBookingReminders}
              trackColor={{ false: colors.muted, true: colors.primary + '80' }}
              thumbColor={bookingReminders ? colors.primary : colors.mutedForeground}
            />
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Mail size={20} color={colors.mutedForeground} />
            <Text style={styles.rowText}>Marketing Emails</Text>
            <Switch
              value={marketingEmails}
              onValueChange={setMarketingEmails}
              trackColor={{ false: colors.muted, true: colors.primary + '80' }}
              thumbColor={marketingEmails ? colors.primary : colors.mutedForeground}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(400).springify()}>
          <AnimatedPressable
            style={styles.signOutBtn}
            onPress={handleSignOut}
          >
            <LogOut size={20} color={colors.destructive} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.foreground, marginLeft: 12 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 32 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: colors.mutedForeground, marginBottom: 8, marginLeft: 4 },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  rowFirst: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  rowLast: { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  rowText: { flex: 1, fontSize: 15, color: colors.foreground, marginLeft: 12 },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 12, backgroundColor: colors.destructive + '15',
    borderWidth: 1, borderColor: colors.destructive + '40',
  },
  signOutText: { fontSize: 16, fontWeight: '600', color: colors.destructive },
});
