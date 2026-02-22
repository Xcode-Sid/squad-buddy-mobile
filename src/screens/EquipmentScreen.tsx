import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { formatPrice } from '../utils/formatting';
import { MOCK_EQUIPMENT } from '../data/equipmentData';
import { SPORTS } from '../data/mockData';
import type { Equipment } from '../data/equipmentData';
import type { EquipmentCondition } from '../data/equipmentData';

const CONDITION_COLORS: Record<EquipmentCondition, string> = {
  new: colors.green500,
  'like-new': colors.blue500,
  good: colors.yellow400 || '#facc15',
  fair: colors.orange500,
};

function EquipmentCard({ item, index }: { item: Equipment; index: number }) {
  const nav = useNavigation<any>();
  const sport = SPORTS.find((s) => s.id === item.sport);
  const condColor = CONDITION_COLORS[item.condition];

  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index, 6) * 80).duration(500)} style={styles.card}>
      <View style={styles.cardRow}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
            <View style={[styles.conditionBadge, { backgroundColor: condColor + '20' }]}>
              <Text style={[styles.conditionText, { color: condColor }]}>
                {item.condition.replace('-', ' ')}
              </Text>
            </View>
          </View>
          <View style={styles.sportRow}>
            <Text style={styles.sportEmoji}>{sport?.emoji}</Text>
            <Text style={styles.sportName}>{sport?.name}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{formatPrice(item.pricePerHour)}/hr</Text>
            <Text style={styles.priceSep}>·</Text>
            <Text style={styles.priceLabel}>{formatPrice(item.pricePerDay)}/day</Text>
          </View>
          <View style={styles.footer}>
            <View style={[styles.availBadge, !item.available && styles.availUnavail]}>
              <Text style={[styles.availText, !item.available && styles.availUnavailText]}>
                {item.available ? 'Available' : 'Unavailable'}
              </Text>
            </View>
            <AnimatedPressable
              style={[styles.rentBtn, !item.available && styles.rentBtnDisabled]}
              onPress={() => {}}
              disabled={!item.available}
            >
              <Text style={styles.rentBtnText}>Rent</Text>
            </AnimatedPressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function EquipmentScreen() {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('');

  const filtered = MOCK_EQUIPMENT.filter((item) => {
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchSport = !selectedSport || item.sport === selectedSport;
    return matchSearch && matchSport;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Equipment</Text>
        <Text style={styles.subtitle}>Rent gear for your game</Text>
      </Animated.View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color={colors.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search equipment..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        <Animated.View entering={FadeInRight.duration(400)}>
          <TouchableOpacity
            style={[styles.chip, !selectedSport && styles.chipActive]}
            onPress={() => setSelectedSport('')}
          >
            <Text style={[styles.chipText, !selectedSport && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
        </Animated.View>
        {SPORTS.slice(0, 10).map((s, i) => (
          <Animated.View key={s.id} entering={FadeInRight.delay((i + 1) * 80).duration(400)}>
            <TouchableOpacity
              style={[styles.chip, selectedSport === s.id && styles.chipActive]}
              onPress={() => setSelectedSport(selectedSport === s.id ? '' : s.id)}
            >
              <Text style={[styles.chipText, selectedSport === s.id && styles.chipTextActive]}>
                {s.emoji} {s.name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <EquipmentCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No equipment found</Text>
          </View>
        }
      />
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  searchRow: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.muted,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 15,
    padding: 0,
  },
  chipsScroll: {
    marginBottom: 12,
  },
  chipsContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingRight: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.foreground,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardImage: {
    width: 100,
    height: '100%',
    minHeight: 120,
    backgroundColor: colors.muted,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 6,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
    flex: 1,
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  conditionText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  sportEmoji: {
    fontSize: 13,
  },
  sportName: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 13,
    color: colors.foreground,
    fontWeight: '600',
  },
  priceSep: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.green500 + '20',
  },
  availUnavail: {
    backgroundColor: colors.orange500 + '20',
  },
  availText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.green500,
  },
  availUnavailText: {
    color: colors.orange500,
  },
  rentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  rentBtnDisabled: {
    backgroundColor: colors.muted,
    opacity: 0.6,
  },
  rentBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.mutedForeground,
  },
});
