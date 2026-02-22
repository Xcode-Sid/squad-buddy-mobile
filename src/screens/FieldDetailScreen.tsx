import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MapPin, Heart, Share2 } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { SPORTS, REVIEWS, generateWeekAvailability } from '../data/mockData';
import { formatPrice } from '../utils/formatting';
import { useField } from '../hooks/useField';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FieldDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = route.params as { id: string };
  const field = useField(id);

  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const galleryRef = useRef<ScrollView>(null);
  const availability = useMemo(() => generateWeekAvailability(), []);

  if (!field) {
    return (
      <SafeAreaView style={styles.safe}>
        <BackButton />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Field not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fieldReviews = REVIEWS.filter((r) => r.fieldId === field.id);
  const images = field.images.length > 0 ? field.images : [field.image];

  const onGalleryScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== currentImage) setCurrentImage(index);
  };

  const onShare = async () => {
    try {
      await Share.share({ message: `Check out ${field.name} on SquadBuddy!` });
    } catch {
      Alert.alert('Error', 'Could not share');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Image Gallery ── */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.galleryContainer}>
          <ScrollView
            ref={galleryRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onGalleryScroll}
          >
            {images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.galleryImage} />
            ))}
          </ScrollView>

          {/* Header overlay: Back / Like / Share */}
          <View style={styles.headerOverlay}>
            <BackButton />
            <View style={styles.headerActions}>
              <AnimatedPressable
                style={styles.headerBtn}
                onPress={() => setLiked(!liked)}
                activeOpacity={0.7}
              >
                <Heart
                  size={20}
                  color={liked ? colors.destructive : colors.white}
                  fill={liked ? colors.destructive : 'transparent'}
                />
              </AnimatedPressable>
              <AnimatedPressable
                style={styles.headerBtn}
                onPress={onShare}
                activeOpacity={0.7}
              >
                <Share2 size={20} color={colors.white} />
              </AnimatedPressable>
            </View>
          </View>

          {/* Dot indicators */}
          {images.length > 1 && (
            <View style={styles.dotsContainer}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === currentImage && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </Animated.View>

        <View style={styles.body}>
          {/* ── Sport Badges ── */}
          <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.sportsRow}>
            {field.sports.map((s) => {
              const sport = SPORTS.find((sp) => sp.id === s);
              return sport ? (
                <View key={s} style={styles.sportBadge}>
                  <Text style={styles.sportBadgeText}>
                    {sport.emoji} {sport.name}
                  </Text>
                </View>
              ) : null;
            })}
          </Animated.View>

          {/* ── Name & Rating ── */}
          <Animated.View entering={FadeInUp.duration(400).delay(200)}>
            <Text style={styles.name}>{field.name}</Text>

            <View style={styles.locationRow}>
              <MapPin size={14} color={colors.mutedForeground} />
              <Text style={styles.location}>{field.location}</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.ratingRow}>
                <Star size={16} color={colors.accent} fill={colors.accent} />
                <Text style={styles.ratingText}>{field.rating}</Text>
                <Text style={styles.reviewCount}>
                  ({field.reviewCount} reviews)
                </Text>
              </View>
              <View
                style={[
                  styles.indoorBadge,
                  {
                    backgroundColor: field.indoor
                      ? colors.secondary + '20'
                      : colors.primary + '15',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.indoorBadgeText,
                    { color: field.indoor ? colors.secondary : colors.primary },
                  ]}
                >
                  {field.indoor ? 'Indoor' : 'Outdoor'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* ── Details Grid ── */}
          <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Surface</Text>
              <Text style={styles.detailValue}>{field.surface}</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Dimensions</Text>
              <Text style={styles.detailValue}>{field.dimensions}</Text>
            </View>
          </Animated.View>

          {/* ── Description ── */}
          <Animated.View entering={FadeInUp.duration(400).delay(400)}>
            <Text style={styles.description}>{field.description}</Text>
          </Animated.View>

          {/* ── Amenities ── */}
          <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesWrap}>
              {field.amenities.map((a, index) => (
                <Animated.View key={a} entering={FadeInRight.duration(400).delay(Math.min(index, 6) * 60)} style={styles.amenityChip}>
                  <Text style={styles.amenityChipText}>
                    {a.replace(/-/g, ' ')}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* ── Pricing ── */}
          <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.pricingGrid}>
              <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>Off-Peak</Text>
                <Text style={[styles.priceValue, { color: colors.primary }]}>
                  {field.pricePerHour.toLocaleString()}
                </Text>
                <Text style={styles.priceUnit}>ALL / hour</Text>
              </View>
              <View style={[styles.priceCard, styles.priceCardPeak]}>
                <Text style={styles.priceLabel}>Peak Hours</Text>
                <Text style={[styles.priceValue, { color: colors.accent }]}>
                  {field.peakPricePerHour.toLocaleString()}
                </Text>
                <Text style={styles.priceUnit}>ALL / hour</Text>
              </View>
            </View>
          </Animated.View>

          {/* ── Availability Calendar ── */}
          <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.availScroll}
            >
              <View>
                {/* Day headers */}
                <View style={styles.availRow}>
                  <View style={styles.availTimeCell} />
                  {availability.map((d) => (
                    <View key={d.day} style={styles.availDayCell}>
                      <Text style={styles.availDayText}>{d.day}</Text>
                    </View>
                  ))}
                </View>
                {/* Time slots (show every other slot to keep it compact) */}
                {availability[0].slots
                  .filter((_, i) => i % 2 === 0)
                  .map((slot, si) => (
                    <View key={slot.time} style={styles.availRow}>
                      <View style={styles.availTimeCell}>
                        <Text style={styles.availTimeText}>{slot.label}</Text>
                      </View>
                      {availability.map((day) => {
                        const s = day.slots[si * 2];
                        return (
                          <View
                            key={`${day.day}-${si}`}
                            style={[
                              styles.availSlotCell,
                              s.status === 'available' && styles.slotAvailable,
                              s.status === 'few' && styles.slotFew,
                              s.status === 'booked' && styles.slotBooked,
                            ]}
                          >
                            <Text
                              style={[
                                styles.availSlotIcon,
                                s.status === 'available' && {
                                  color: colors.primary,
                                },
                                s.status === 'few' && {
                                  color: colors.accent,
                                },
                                s.status === 'booked' && {
                                  color: colors.destructive + '80',
                                },
                              ]}
                            >
                              {s.status === 'available'
                                ? '●'
                                : s.status === 'few'
                                  ? '◐'
                                  : '○'}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}

                {/* Legend */}
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: colors.primary + '30' },
                      ]}
                    />
                    <Text style={styles.legendText}>Available</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: colors.accent + '30' },
                      ]}
                    />
                    <Text style={styles.legendText}>Few Left</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: colors.destructive + '18' },
                      ]}
                    />
                    <Text style={styles.legendText}>Booked</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </Animated.View>

          {/* ── Reviews ── */}
          <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {fieldReviews.length === 0 ? (
              <Text style={styles.noReviews}>No reviews yet</Text>
            ) : (
              fieldReviews.map((r, index) => (
                <Animated.View key={r.id} entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 80)} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: r.player.avatar }}
                      style={styles.reviewAvatar}
                    />
                    <View style={styles.reviewMeta}>
                      <Text style={styles.reviewPlayer}>{r.player.name}</Text>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={12}
                            color={
                              i <= r.rating ? colors.accent : colors.muted
                            }
                            fill={
                              i <= r.rating ? colors.accent : 'transparent'
                            }
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <Text style={styles.reviewComment}>{r.comment}</Text>
                </Animated.View>
              ))
            )}
          </Animated.View>

          {/* ── Map Placeholder ── */}
          <Animated.View entering={FadeInUp.duration(400)} style={styles.mapPlaceholder}>
            <MapPin size={24} color={colors.mutedForeground} />
            <Text style={styles.mapText}>{field.location}</Text>
          </Animated.View>

          {/* ── Book Now ── */}
          <Animated.View entering={FadeInUp.duration(500).springify()}>
            <AnimatedPressable
              style={styles.bookBtn}
              onPress={() => nav.navigate('Booking', { id: field.id })}
              activeOpacity={0.85}
            >
              <View style={styles.bookBtnInner}>
                <View>
                  <Text style={styles.bookBtnPrice}>
                    {formatPrice(field.pricePerHour)}
                    <Text style={styles.bookBtnPriceUnit}> / hour</Text>
                  </Text>
                </View>
                <Text style={styles.bookBtnText}>Book Now</Text>
              </View>
            </AnimatedPressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  /* Gallery */
  galleryContainer: {
    position: 'relative',
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: 260,
    backgroundColor: colors.muted,
  },
  headerOverlay: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: colors.white,
  },

  /* Body */
  body: {
    padding: 20,
    marginTop: -12,
  },

  /* Sports row */
  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  sportBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sportBadgeText: {
    fontSize: 12,
    color: colors.primary,
  },

  /* Field info */
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
  },
  reviewCount: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginLeft: 4,
  },
  indoorBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  indoorBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    color: colors.mutedForeground,
    flex: 1,
  },

  /* Details Grid */
  detailsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },

  /* Description */
  description: {
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 22,
    marginBottom: 24,
  },

  /* Sections */
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },

  /* Amenities */
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amenityChipText: {
    fontSize: 13,
    color: colors.foreground,
    textTransform: 'capitalize',
  },

  /* Pricing */
  pricingGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  priceCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  priceCardPeak: {
    borderColor: colors.accent + '30',
  },
  priceLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 6,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  priceUnit: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 4,
  },

  /* Availability */
  availScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  availRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availTimeCell: {
    width: 56,
    paddingVertical: 4,
    paddingRight: 4,
  },
  availTimeText: {
    fontSize: 9,
    color: colors.mutedForeground,
  },
  availDayCell: {
    width: 40,
    alignItems: 'center',
    paddingVertical: 6,
  },
  availDayText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  availSlotCell: {
    width: 40,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginVertical: 1,
  },
  slotAvailable: {
    backgroundColor: colors.primary + '25',
  },
  slotFew: {
    backgroundColor: colors.accent + '25',
  },
  slotBooked: {
    backgroundColor: colors.destructive + '15',
  },
  availSlotIcon: {
    fontSize: 10,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    paddingLeft: 56,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    color: colors.mutedForeground,
  },

  /* Reviews */
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.muted,
    marginRight: 10,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewPlayer: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 13,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  noReviews: {
    fontSize: 14,
    color: colors.mutedForeground,
  },

  /* Map */
  mapPlaceholder: {
    height: 140,
    borderRadius: 16,
    backgroundColor: colors.muted + '50',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mapText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 6,
  },

  /* Book button */
  bookBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  bookBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookBtnPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  bookBtnPriceUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.primaryForeground + 'CC',
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryForeground,
  },

  /* Not found */
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
});
