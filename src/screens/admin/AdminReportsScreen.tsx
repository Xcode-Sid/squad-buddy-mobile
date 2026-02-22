import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, AlertTriangle, Ban } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useAdmin } from '../../context/AdminContext';

const REPORTS = [
  { id: 'r1', userName: 'Andi Hoxha', reason: 'Inappropriate behavior during match', severity: 'high' as const, time: '10 min ago' },
  { id: 'r2', userName: 'Elira Murati', reason: 'Spam in comments', severity: 'low' as const, time: '1 hour ago' },
  { id: 'r3', userName: 'Dritan Leka', reason: 'Fake field listing', severity: 'high' as const, time: '2 hours ago' },
  { id: 'r4', userName: 'Sara Basha', reason: 'Payment dispute', severity: 'medium' as const, time: '3 hours ago' },
  { id: 'r5', userName: 'Arben Krasniqi', reason: 'Harassment report', severity: 'medium' as const, time: '5 hours ago' },
];

const SEV_COLORS: Record<string, string> = { high: colors.destructive, medium: colors.accent, low: colors.secondary };

export default function AdminReportsScreen() {
  const { dismissedReports, dismissReport } = useAdmin();
  const active = REPORTS.filter(r => !dismissedReports.has(r.id));

  const counts = { high: active.filter(r => r.severity === 'high').length, medium: active.filter(r => r.severity === 'medium').length, low: active.filter(r => r.severity === 'low').length };

  const handleAction = (id: string, action: 'dismiss' | 'warn' | 'ban') => {
    if (action === 'dismiss') dismissReport(id);
    else Alert.alert(action === 'warn' ? 'Warn User' : 'Ban User', `Action: ${action}`);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}><Text style={s.title}>Reports</Text></View>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.badges}>
          {(['high', 'medium', 'low'] as const).map(sev => (
            <View key={sev} style={[s.badge, { backgroundColor: SEV_COLORS[sev] + '30' }]}>
              <Text style={[s.badgeCount, { color: SEV_COLORS[sev] }]}>{counts[sev]}</Text>
              <Text style={s.badgeLabel}>{sev.charAt(0).toUpperCase() + sev.slice(1)}</Text>
            </View>
          ))}
        </View>

        {active.map(r => (
          <View key={r.id} style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardUser}>{r.userName}</Text>
              <View style={[s.sevBadge, { backgroundColor: SEV_COLORS[r.severity] + '30' }]}>
                <Text style={[s.sevText, { color: SEV_COLORS[r.severity] }]}>{r.severity}</Text>
              </View>
            </View>
            <Text style={s.reason}>{r.reason}</Text>
            <Text style={s.time}>{r.time}</Text>
            <View style={s.actions}>
              <TouchableOpacity style={s.actionBtn} onPress={() => handleAction(r.id, 'dismiss')}>
                <X size={14} color={colors.mutedForeground} /><Text style={s.actionText}>Dismiss</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionBtn} onPress={() => handleAction(r.id, 'warn')}>
                <AlertTriangle size={14} color={colors.accent} /><Text style={[s.actionText, { color: colors.accent }]}>Warn</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionBtn} onPress={() => handleAction(r.id, 'ban')}>
                <Ban size={14} color={colors.destructive} /><Text style={[s.actionText, { color: colors.destructive }]}>Ban</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {active.length === 0 && <Text style={s.empty}>No active reports</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 20, fontWeight: '700', color: colors.foreground },
  content: { padding: 16, paddingBottom: 24, gap: 10 },
  badges: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  badge: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  badgeCount: { fontSize: 22, fontWeight: '700' },
  badgeLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  cardUser: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  sevText: { fontSize: 11, fontWeight: '600' },
  reason: { fontSize: 13, color: colors.foreground, marginBottom: 3 },
  time: { fontSize: 11, color: colors.mutedForeground, marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 8 },
  actionText: { fontSize: 12, color: colors.mutedForeground, fontWeight: '500' },
  empty: { fontSize: 14, color: colors.mutedForeground, textAlign: 'center', marginTop: 40 },
});
