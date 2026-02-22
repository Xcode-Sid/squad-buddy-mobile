import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Ban, CheckCircle, MapPin, UserCheck } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice } from '../../utils/formatting';
import { PLAYERS, FIELDS } from '../../data/mockData';
import PlayerAvatar from '../../components/PlayerAvatar';

const MOCK_BUSINESSES = [
  { id: 'b1', name: 'Arena Sport Tirana', owner: 'Artan Koci', city: 'Tirana', fields: 3, revenue: 1280000, verified: true },
  { id: 'b2', name: 'Kompleksi Sportiv Dinamo', owner: 'Elira Murati', city: 'Tirana', fields: 5, revenue: 980000, verified: true },
  { id: 'b3', name: 'Padel Club Durrës', owner: 'Dritan Leka', city: 'Durrës', fields: 2, revenue: 650000, verified: false },
  { id: 'b4', name: 'Basketball Center Vlorë', owner: 'Sara Basha', city: 'Vlorë', fields: 1, revenue: 420000, verified: true },
  { id: 'b5', name: 'Tennis Academy Shkodër', owner: 'Arben Krasniqi', city: 'Shkodër', fields: 4, revenue: 780000, verified: true },
];

export default function AdminUsersScreen() {
  const { bannedUsers, toggleUserBan } = useAdmin();
  const [search, setSearch] = useState('');

  const filtered = PLAYERS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}><Text style={s.title}>Users</Text></View>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.searchBar}>
          <Search size={18} color={colors.mutedForeground} />
          <TextInput style={s.searchInput} placeholder="Search users..." placeholderTextColor={colors.mutedForeground} value={search} onChangeText={setSearch} />
        </View>

        <Text style={s.section}>Individual Users</Text>
        {filtered.map(user => {
          const banned = bannedUsers.has(user.id);
          return (
            <View key={user.id} style={s.userCard}>
              <PlayerAvatar uri={user.avatar} size="md" name={user.name} />
              <View style={{ flex: 1 }}>
                <Text style={s.userName}>{user.name}</Text>
                <Text style={s.userSub}>{user.username}</Text>
              </View>
              <TouchableOpacity style={[s.banBtn, banned && s.banBtnActive]} onPress={() => toggleUserBan(user.id)}>
                {banned ? <UserCheck size={16} color={colors.primary} /> : <Ban size={16} color={colors.destructive} />}
                <Text style={[s.banText, banned && { color: colors.primary }]}>{banned ? 'Unban' : 'Ban'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <Text style={[s.section, { marginTop: 20 }]}>Business Accounts</Text>
        {MOCK_BUSINESSES.map(biz => (
          <View key={biz.id} style={s.bizCard}>
            <View style={s.bizRow}>
              <Text style={s.bizName}>{biz.name}</Text>
              {biz.verified && <CheckCircle size={14} color={colors.primary} />}
            </View>
            <Text style={s.bizOwner}>Owner: {biz.owner}</Text>
            <View style={s.bizMeta}>
              <MapPin size={12} color={colors.mutedForeground} />
              <Text style={s.bizMetaText}>{biz.city} • {biz.fields} fields</Text>
              <Text style={s.bizRev}>{formatPrice(biz.revenue)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 20, fontWeight: '700', color: colors.foreground },
  content: { padding: 16, paddingBottom: 24, gap: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, fontSize: 14, color: colors.foreground, padding: 0 },
  section: { fontSize: 15, fontWeight: '700', color: colors.foreground, marginTop: 4 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 12, padding: 12, gap: 10, borderWidth: 1, borderColor: colors.border },
  userName: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  userSub: { fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  banBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: colors.destructive + '20' },
  banBtnActive: { backgroundColor: colors.primary + '20' },
  banText: { fontSize: 11, color: colors.destructive, fontWeight: '600' },
  bizCard: { backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  bizRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bizName: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  bizOwner: { fontSize: 12, color: colors.mutedForeground, marginTop: 3 },
  bizMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  bizMetaText: { fontSize: 11, color: colors.mutedForeground },
  bizRev: { fontSize: 13, fontWeight: '600', color: colors.primary, marginLeft: 'auto' },
});
