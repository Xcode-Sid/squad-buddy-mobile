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
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Calendar, MapPin } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { UPCOMING_BOOKINGS, PAST_BOOKINGS, SPORTS } from '../data/mockData';
import { formatDateLabel } from '../utils/dates';
import { getBookingStatusStyle } from '../utils/formatting';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';

type TabType = 'upcoming' | 'past';

export default function MyBookingsScreen() {
  const nav = useNavigation<any>();
  const [tab, setTab] = useState<TabType>('upcoming');

  const bookings = tab === 'upcoming' ? UPCOMING_BOOKINGS : PAST_BOOKINGS;

  const renderBookingCard = ({
    item,
  }: {
    item: (typeof UPCOMING_BOOKINGS)[0] | (typeof PAST_BOOKINGS)[0];
  }) => {
    const sport = SPORTS.find((s) => s.id === item.sport);
    const statusStyle = getBookingStatusStyle(item.status);

    return (
      <AnimatedPressable
        style={styles.card}
        onPress={() => nav.navigate('FieldDetail', { id: item.field.id })}
      >
        <Image source={{ uri: item.field.image }} style={styles.cardImage} />
        <View style={styles.cardBody}>
          <Text style={styles.cardName}>{item.field.name}</Text>
          <View style={styles.cardMeta}>
            <Calendar size={14} color={colors.mutedForeground} />
            <Text style={styles.cardMetaText}>
              {formatDateLabel(item.date)} • {item.time}
            </Text>
          </View>
          <View style={styles.cardMeta}>
            <MapPin size={14} color={colors.mutedForeground} />
            <Text style={styles.cardMetaText} numberOfLines={1}>
              {item.field.location}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.sportBadge}>
              <Text style={styles.sportText}>
                {sport?.emoji} {sport?.name ?? item.sport}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'upcoming' && styles.tabActive]}
          onPress={() => setTab('upcoming')}
        >
          <Text
            style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'past' && styles.tabActive]}
          onPress={() => setTab('past')}
        >
          <Text
            style={[styles.tabText, tab === 'past' && styles.tabTextActive]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings as Array<(typeof UPCOMING_BOOKINGS)[0] | (typeof PAST_BOOKINGS)[0]>}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No {tab} bookings
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.foreground,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  tabTextActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.muted,
  },
  cardBody: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  cardMetaText: {
    fontSize: 13,
    color: colors.mutedForeground,
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sportBadge: {
    backgroundColor: colors.muted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sportText: {
    fontSize: 12,
    color: colors.foreground,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
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
