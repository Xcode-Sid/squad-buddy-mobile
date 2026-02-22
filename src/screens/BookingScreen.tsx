import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useField } from '../hooks/useField';
import { useBookingSteps, BOOKING_STEPS } from '../hooks/useBookingSteps';
import { PLAYERS, TIME_SLOTS, SPORTS } from '../data/mockData';
import { generateUpcomingDates } from '../utils/dates';
import { formatPrice } from '../utils/formatting';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';

export default function BookingScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { id } = (route.params ?? {}) as { id?: string };
  const field = useField(id);
  const {
    step,
    selectedDate,
    selectedTime,
    bookingType,
    selectedPlayers,
    nextStep,
    prevStep,
    setDate,
    setTime,
    setBookingType,
    togglePlayer,
  } = useBookingSteps();

  const dates = generateUpcomingDates(14);

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

  const sport = SPORTS.find((s) => s.id === field.sports[0]);
  const price = field.pricePerHour;
  const selectedPlayerList = PLAYERS.filter((p) => selectedPlayers.includes(p.id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Book Field</Text>
      </Animated.View>

      {/* Step indicator */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.stepIndicator}>
        {BOOKING_STEPS.map((label, i) => (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                i <= step && styles.stepDotActive,
                i < step && styles.stepDotDone,
              ]}
            >
              {i < step ? (
                <Check size={14} color={colors.background} />
              ) : (
                <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>
                  {i + 1}
                </Text>
              )}
            </View>
            {i < BOOKING_STEPS.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
            )}
          </View>
        ))}
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 0: Date & Time */}
        {step === 0 && (
          <>
            <Animated.View entering={FadeInUp.duration(400)}>
              <Text style={styles.sectionTitle}>Select Date</Text>
            </Animated.View>
            <Animated.View entering={FadeInUp.duration(400).delay(80)}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateScroll}
              >
                {dates.map((d) => (
                  <AnimatedPressable
                    key={d.date}
                    style={[
                      styles.dateCard,
                      selectedDate === d.date && styles.dateCardSelected,
                    ]}
                    onPress={() => setDate(d.date)}
                  >
                    <Text
                      style={[
                        styles.dateDay,
                        selectedDate === d.date && styles.dateDaySelected,
                      ]}
                    >
                      {d.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateNum,
                        selectedDate === d.date && styles.dateNumSelected,
                      ]}
                    >
                      {d.num}
                    </Text>
                  </AnimatedPressable>
                ))}
              </ScrollView>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(400).delay(160)}>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Select Time
              </Text>
            </Animated.View>
            <Animated.View entering={FadeInUp.duration(400).delay(240)}>
              <View style={styles.timeGrid}>
                {TIME_SLOTS.map((slot) => (
                  <AnimatedPressable
                    key={slot.time}
                    style={[
                      styles.timeSlot,
                      selectedTime === slot.time && styles.timeSlotSelected,
                    ]}
                    onPress={() => setTime(slot.time)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedTime === slot.time && styles.timeSlotTextSelected,
                      ]}
                    >
                      {slot.label}
                    </Text>
                  </AnimatedPressable>
                ))}
              </View>
            </Animated.View>
          </>
        )}

        {/* Step 1: Booking Type */}
        {step === 1 && (
          <>
            <Animated.View entering={FadeInUp.duration(400)}>
              <Text style={styles.sectionTitle}>Booking Type</Text>
            </Animated.View>
            <Animated.View entering={FadeInUp.duration(400).delay(80)}>
              <View style={styles.typeRow}>
                <AnimatedPressable
                  style={[
                    styles.typeCard,
                    bookingType === 'single' && styles.typeCardSelected,
                  ]}
                  onPress={() => setBookingType('single')}
                >
                  <Text
                    style={[
                      styles.typeTitle,
                      bookingType === 'single' && styles.typeTitleSelected,
                    ]}
                  >
                    Single
                  </Text>
                  <Text style={styles.typeDesc}>One-time booking</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  style={[
                    styles.typeCard,
                    bookingType === 'recurring' && styles.typeCardSelected,
                  ]}
                  onPress={() => setBookingType('recurring')}
                >
                  <Text
                    style={[
                      styles.typeTitle,
                      bookingType === 'recurring' && styles.typeTitleSelected,
                    ]}
                  >
                    Recurring
                  </Text>
                  <Text style={styles.typeDesc}>Weekly repeat</Text>
                </AnimatedPressable>
              </View>
            </Animated.View>
          </>
        )}

        {/* Step 2: Players */}
        {step === 2 && (
          <>
            <Animated.View entering={FadeInUp.duration(400)}>
              <Text style={styles.sectionTitle}>Select Teammates</Text>
            </Animated.View>
            <FlatList
              data={PLAYERS}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.playerRow}
              renderItem={({ item, index }) => {
                const selected = selectedPlayers.includes(item.id);
                return (
                  <Animated.View entering={ZoomIn.duration(400).delay(Math.min(index, 6) * 80)} style={{flex: 1}}>
                    <AnimatedPressable
                      style={[
                        styles.playerCard,
                        selected && styles.playerCardSelected,
                      ]}
                      onPress={() => togglePlayer(item.id)}
                    >
                      <Image
                        source={{ uri: item.avatar }}
                        style={styles.playerAvatar}
                      />
                      <Text style={styles.playerName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.playerUsername} numberOfLines={1}>
                        {item.username}
                      </Text>
                    </AnimatedPressable>
                  </Animated.View>
                );
              }}
            />
          </>
        )}

        {/* Step 3: Payment Summary */}
        {step === 3 && (
          <>
            <Animated.View entering={FadeInUp.duration(400)}>
              <Text style={styles.sectionTitle}>Payment Summary</Text>
            </Animated.View>
            <Animated.View entering={FadeInUp.duration(500).delay(80)} style={styles.summaryCard}>
              <Image source={{ uri: field.image }} style={styles.summaryImage} />
              <View style={styles.summaryBody}>
                <Text style={styles.summaryName}>{field.name}</Text>
                <Text style={styles.summaryMeta}>
                  {sport?.emoji} {sport?.name ?? field.sports[0]}
                </Text>
                <Text style={styles.summaryMeta}>
                  {selectedDate} • {selectedTime}
                </Text>
                <Text style={styles.summaryMeta}>
                  {bookingType === 'recurring' ? 'Recurring weekly' : 'Single'}
                </Text>
                {selectedPlayerList.length > 0 && (
                  <Text style={styles.summaryMeta}>
                    +{selectedPlayerList.length} teammate(s)
                  </Text>
                )}
                <Text style={styles.summaryPrice}>
                  {formatPrice(price)} / hr
                </Text>
              </View>
            </Animated.View>
          </>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <Animated.View entering={ZoomIn.duration(500)} style={styles.confirmWrap}>
            <View style={styles.checkWrap}>
              <Check size={48} color={colors.primary} strokeWidth={3} />
            </View>
            <Text style={styles.confirmTitle}>Booking Confirmed!</Text>
            <Text style={styles.confirmDesc}>
              Your booking at {field.name} is confirmed for {selectedDate} at{' '}
              {selectedTime}.
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      <Animated.View entering={FadeInUp.duration(400).springify()} style={styles.footer}>
        {step > 0 ? (
          <AnimatedPressable
            style={styles.backBtn}
            onPress={prevStep}
            activeOpacity={0.85}
          >
            <ChevronLeft size={20} color={colors.foreground} />
            <Text style={styles.backBtnText}>Back</Text>
          </AnimatedPressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        {step < 4 ? (
          <AnimatedPressable
            style={styles.nextBtn}
            onPress={nextStep}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Next</Text>
            <ChevronRight size={20} color={colors.primaryForeground} />
          </AnimatedPressable>
        ) : (
          <AnimatedPressable
            style={styles.nextBtn}
            onPress={() => nav.navigate('IndividualTabs')}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Done</Text>
            <Check size={20} color={colors.primaryForeground} />
          </AnimatedPressable>
        )}
      </Animated.View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginLeft: 12,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotDone: {
    backgroundColor: colors.primary,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  stepNumActive: {
    color: colors.primaryForeground,
  },
  stepLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.muted,
    marginHorizontal: 4,
  },
  stepLineDone: {
    backgroundColor: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  dateScroll: {
    gap: 10,
    paddingRight: 20,
  },
  dateCard: {
    width: 56,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dateCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  dateDay: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  dateDaySelected: {
    color: colors.primary,
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  dateNumSelected: {
    color: colors.primary,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  timeSlotSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  timeSlotText: {
    fontSize: 13,
    color: colors.foreground,
  },
  timeSlotTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    padding: 20,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  typeTitleSelected: {
    color: colors.primary,
  },
  typeDesc: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  playerRow: {
    gap: 12,
    marginBottom: 12,
  },
  playerCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  playerCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  playerUsername: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryImage: {
    width: 100,
    height: 120,
    backgroundColor: colors.muted,
  },
  summaryBody: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  summaryName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  summaryMeta: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginBottom: 2,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  confirmWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  checkWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 8,
  },
  confirmDesc: {
    fontSize: 15,
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
});
