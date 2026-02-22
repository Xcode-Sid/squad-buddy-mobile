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
import { Search, Star, MapPin, Clock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { MOCK_VENUES } from '../data/venuesData';
import { SPORTS } from '../data/mockData';
import type { Venue } from '../data/venuesData';

function VenueCard({ item, index }: { item: Venue; index: number }) {
  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index, 6) * 80).duration(500)} style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.cardImageWrap}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          {item.isPartner && (
            <View style={styles.partnerBadge}>
              <Text style={styles.partnerText}>Partner</Text>
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={12} color={colors.mutedForeground} />
            <Text style={styles.cityText}>{item.city}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Star size={12} color={colors.accent} fill={colors.accent} />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewText}>({item.reviewCount})</Text>
          </View>
          <View style={styles.sportsRow}>
            {item.sports.slice(0, 4).map((sportId) => {
              const sport = SPORTS.find((s) => s.id === sportId);
              return (
                <View key={sportId} style={styles.sportChip}>
                  <Text style={styles.sportChipText}>{sport?.emoji} {sport?.name}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.hoursRow}>
            <Clock size={12} color={colors.mutedForeground} />
            <Text style={styles.hoursText}>
              {item.openTime} - {item.closeTime}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function VenuesScreen() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const cities = [...new Set(MOCK_VENUES.map((v) => v.city))];

  const filtered = MOCK_VENUES.filter((item) => {
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.city.toLowerCase().includes(search.toLowerCase());
    const matchCity = !selectedCity || item.city === selectedCity;
    return matchSearch && matchCity;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Venues</Text>
        <Text style={styles.subtitle}>Discover sports venues</Text>
      </Animated.View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color={colors.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search venues..."
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
          <AnimatedPressable
            style={[styles.chip, !selectedCity && styles.chipActive]}
            onPress={() => setSelectedCity('')}
          >
            <Text style={[styles.chipText, !selectedCity && styles.chipTextActive]}>All</Text>
          </AnimatedPressable>
        </Animated.View>
        {cities.map((city, i) => (
          <Animated.View key={city} entering={FadeInRight.delay((i + 1) * 80).duration(400)}>
            <AnimatedPressable
              style={[styles.chip, selectedCity === city && styles.chipActive]}
              onPress={() => setSelectedCity(selectedCity === city ? '' : city)}
            >
              <Text style={[styles.chipText, selectedCity === city && styles.chipTextActive]}>
                {city}
              </Text>
            </AnimatedPressable>
          </Animated.View>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <VenueCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No venues found</Text>
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
  cardImageWrap: {
    position: 'relative',
  },
  cardImage: {
    width: 110,
    height: '100%',
    minHeight: 130,
    backgroundColor: colors.muted,
  },
  partnerBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.primary + 'CC',
  },
  partnerText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  cityText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  reviewText: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  sportChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.muted,
  },
  sportChipText: {
    fontSize: 10,
    color: colors.foreground,
    textTransform: 'capitalize',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hoursText: {
    fontSize: 11,
    color: colors.mutedForeground,
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
