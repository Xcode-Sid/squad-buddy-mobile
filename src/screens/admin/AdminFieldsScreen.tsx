import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Ban, MapPin, Star, UserCheck } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice } from '../../utils/formatting';
import { FIELDS, SPORTS } from '../../data/mockData';

export default function AdminFieldsScreen() {
  const { bannedFields, toggleFieldBan } = useAdmin();
  const [search, setSearch] = useState('');

  const filtered = FIELDS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) || f.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}><Text style={s.title}>Fields</Text></View>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.searchBar}>
          <Search size={18} color={colors.mutedForeground} />
          <TextInput style={s.searchInput} placeholder="Search fields..." placeholderTextColor={colors.mutedForeground} value={search} onChangeText={setSearch} />
        </View>
        {filtered.map(field => {
          const banned = bannedFields.has(field.id);
          const sportNames = field.sports.map(sid => SPORTS.find(sp => sp.id === sid)?.name ?? sid).join(', ');
          return (
            <View key={field.id} style={s.fieldCard}>
              <Image source={{ uri: field.image }} style={s.fieldImg} />
              <View style={s.fieldInfo}>
                <Text style={s.fieldName} numberOfLines={1}>{field.name}</Text>
                <View style={s.meta}><MapPin size={11} color={colors.mutedForeground} /><Text style={s.metaText}>{field.city}</Text></View>
                <View style={s.meta}><Star size={11} color={colors.yellow400} /><Text style={s.metaText}>{field.rating} • {formatPrice(field.pricePerHour)}/hr</Text></View>
                <Text style={s.sports}>{sportNames}</Text>
                <TouchableOpacity style={[s.banBtn, banned && s.banBtnActive]} onPress={() => toggleFieldBan(field.id)}>
                  {banned ? <UserCheck size={14} color={colors.primary} /> : <Ban size={14} color={colors.destructive} />}
                  <Text style={[s.banText, banned && { color: colors.primary }]}>{banned ? 'Unban' : 'Ban'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
  fieldCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  fieldImg: { width: 90, height: 100, backgroundColor: colors.muted },
  fieldInfo: { flex: 1, padding: 10 },
  fieldName: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  metaText: { fontSize: 11, color: colors.mutedForeground },
  sports: { fontSize: 10, color: colors.mutedForeground, marginTop: 3 },
  banBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingHorizontal: 8, borderRadius: 8, backgroundColor: colors.destructive + '20', marginTop: 4, alignSelf: 'flex-start' },
  banBtnActive: { backgroundColor: colors.primary + '20' },
  banText: { fontSize: 11, color: colors.destructive, fontWeight: '600' },
});
