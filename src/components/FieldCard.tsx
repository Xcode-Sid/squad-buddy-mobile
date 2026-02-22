import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MapPin, Star } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { formatPrice } from '../utils/formatting';
import { getAvailabilityColor, getAvailabilityLabel } from '../utils/styles';
import { SPORTS, type Field } from '../data/mockData';
import AnimatedPressable from './AnimatedPressable';

interface Props {
  field: Field;
  onPress?: () => void;
}

export default function FieldCard({ field, onPress }: Props) {
  const avail = getAvailabilityColor(field.availability);

  return (
    <AnimatedPressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: field.image }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{field.name}</Text>
        <View style={styles.row}>
          <MapPin size={12} color={colors.mutedForeground} />
          <Text style={styles.location} numberOfLines={1}>{field.location}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.ratingBadge}>
            <Star size={10} color={colors.accent} fill={colors.accent} />
            <Text style={styles.ratingText}>{field.rating}</Text>
          </View>
          <Text style={styles.price}>{formatPrice(field.pricePerHour)}/hr</Text>
          <Animated.View entering={FadeIn.delay(200)} style={[styles.availBadge, { backgroundColor: avail.bg }]}>
            <Text style={[styles.availText, { color: avail.text }]}>{getAvailabilityLabel(field.availability)}</Text>
          </Animated.View>
        </View>
        <View style={styles.sportsRow}>
          {field.sports.slice(0, 3).map((s) => {
            const sport = SPORTS.find((sp) => sp.id === s);
            return sport ? (
              <View key={s} style={styles.sportChip}>
                <Text style={styles.sportText}>{sport.emoji} {sport.name}</Text>
              </View>
            ) : null;
          })}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: colors.muted,
  },
  body: {
    padding: 12,
    gap: 6,
  },
  name: {
    color: colors.foreground,
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    color: colors.mutedForeground,
    fontSize: 11,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  price: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 8,
  },
  availBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  availText: {
    fontSize: 9,
    fontWeight: '600',
  },
  sportsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  sportChip: {
    backgroundColor: colors.muted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sportText: {
    color: colors.mutedForeground,
    fontSize: 9,
  },
});
