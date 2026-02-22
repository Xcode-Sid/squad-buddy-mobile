import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Send,
  GitCompare,
  LayoutGrid,
  List,
  ChevronRight,
  MapPin,
  Star,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { FIELDS, SPORTS, type Field } from '../data/mockData';
import { formatPrice } from '../utils/formatting';
import { useExploreFilters } from '../hooks/useExploreFilters';
import FieldCard from '../components/FieldCard';
import AnimatedPressable from '../components/AnimatedPressable';
import BackButton from '../components/BackButton';

type ViewMode = 'grid' | 'list';

interface AiRecommendation {
  fields: Field[];
  message: string;
  tags: string[];
}

function generateAiRecommendation(prompt: string): AiRecommendation {
  const q = prompt.toLowerCase();
  let fields = [...FIELDS];
  const tags: string[] = [];
  const parts: string[] = [];

  const sportMatch = SPORTS.find(
    (s) => q.includes(s.name.toLowerCase()) || q.includes(s.id),
  );
  if (sportMatch) {
    fields = fields.filter((f) => f.sports.includes(sportMatch.id));
    tags.push(sportMatch.emoji + ' ' + sportMatch.name);
    parts.push(`${sportMatch.name} fields`);
  }

  const cityMatch = [
    'tirana', 'durrës', 'durres', 'vlorë', 'vlore',
    'shkodër', 'shkoder', 'elbasan', 'korçë', 'korce', 'fier', 'berat',
  ].find((c) => q.includes(c));
  if (cityMatch) {
    const normalCity = cityMatch.charAt(0).toUpperCase() + cityMatch.slice(1);
    fields = fields.filter((f) =>
      f.city.toLowerCase().startsWith(cityMatch.slice(0, 4)),
    );
    tags.push('📍 ' + normalCity);
    parts.push(`in ${normalCity}`);
  }

  if (q.includes('cheap') || q.includes('budget') || q.includes('affordable') || q.includes('low price') || q.includes('lir')) {
    fields.sort((a, b) => a.pricePerHour - b.pricePerHour);
    tags.push('💰 Budget');
    parts.push('sorted by lowest price');
  } else if (q.includes('best') || q.includes('top') || q.includes('highest rated') || q.includes('popular') || q.includes('recommend')) {
    fields.sort((a, b) => b.rating - a.rating);
    tags.push('⭐ Top Rated');
    parts.push('sorted by highest rating');
  } else if (q.includes('expensive') || q.includes('premium') || q.includes('luxury') || q.includes('vip')) {
    fields.sort((a, b) => b.pricePerHour - a.pricePerHour);
    tags.push('💎 Premium');
    parts.push('showing premium options');
  } else {
    fields.sort((a, b) => b.rating - a.rating);
  }

  if (q.includes('available') || q.includes('free') || q.includes('open')) {
    fields = fields.filter((f) => f.availability === 'available');
    tags.push('✅ Available');
    parts.push('with open slots');
  }
  if (q.includes('indoor')) {
    tags.push('🏠 Indoor');
    parts.push('indoor facilities');
  }
  if (q.includes('outdoor')) {
    tags.push('🌤️ Outdoor');
    parts.push('outdoor fields');
  }
  if (q.includes('night') || q.includes('evening') || q.includes('late')) {
    tags.push('🌙 Night');
    parts.push('with evening availability');
  }
  if (q.includes('near me') || q.includes('closest') || q.includes('nearby')) {
    tags.push('📍 Nearby');
    parts.push('closest to you');
  }
  if (q.includes('group') || q.includes('team') || q.includes('friends') || q.includes('squad')) {
    tags.push('👥 Team');
    parts.push('great for team play');
  }

  const resultFields = fields.slice(0, 6);
  let message: string;

  if (resultFields.length === 0) {
    message = `I couldn't find fields matching "${prompt}". Try searching for a sport or city.`;
  } else if (parts.length > 0) {
    message = `Found ${resultFields.length} fields — ${parts.join(', ')}. Here are my top picks:`;
  } else {
    const topField = resultFields[0];
    message = `Here are ${resultFields.length} great options! Top pick: ${topField.name} in ${topField.city} (★ ${topField.rating}, ${formatPrice(topField.pricePerHour)}/hr).`;
  }

  return { fields: resultFields, message, tags };
}

const AI_SUGGESTIONS = [
  'Football in Tirana',
  'Best rated fields',
  'Indoor padel courts',
  'Cheapest near me',
];

export default function ExploreScreen() {
  const nav = useNavigation<any>();
  const {
    search,
    setSearch,
    selectedSport,
    setSelectedSport,
    clearSport,
    selectedCity,
    setSelectedCity,
    clearCity,
    sortBy,
    setSortBy,
    showFilters,
    toggleFilters,
    cities,
    filteredFields,
    hasActiveFilters,
  } = useExploreFilters();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState<AiRecommendation | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const handleAiSearch = useCallback(() => {
    const trimmed = aiPrompt.trim();
    if (!trimmed) return;
    setAiLoading(true);
    setTimeout(() => {
      const result = generateAiRecommendation(trimmed);
      setAiResult(result);
      setAiLoading(false);
    }, 600 + Math.random() * 600);
  }, [aiPrompt]);

  const clearAi = () => {
    setAiResult(null);
    setAiPrompt('');
    setShowAi(false);
  };

  const displayFields = aiResult ? aiResult.fields : filteredFields;

  const renderCompactItem = ({ item }: { item: Field }) => (
    <TouchableOpacity
      style={styles.compactCard}
      onPress={() => nav.navigate('FieldDetail', { id: item.id })}
      activeOpacity={0.8}
    >
      <View style={styles.compactLeft}>
        <Text style={styles.compactName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.compactRow}>
          <MapPin size={10} color={colors.mutedForeground} />
          <Text style={styles.compactLocation} numberOfLines={1}>{item.city}</Text>
        </View>
      </View>
      <View style={styles.compactRight}>
        <View style={styles.compactRating}>
          <Star size={10} color={colors.accent} fill={colors.accent} />
          <Text style={styles.compactRatingText}>{item.rating}</Text>
        </View>
        <Text style={styles.compactPrice}>{formatPrice(item.pricePerHour)}/hr</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Field }) =>
    viewMode === 'list' ? (
      renderCompactItem({ item })
    ) : (
      <FieldCard
        field={item}
        onPress={() => nav.navigate('FieldDetail', { id: item.id })}
      />
    );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.headerRow}>
          <BackButton />
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Explore Fields</Text>
            <Text style={styles.subtitle}>Find the perfect field for your game</Text>
          </View>
          <AnimatedPressable
            style={styles.compareBtn}
            onPress={() => nav.navigate('Compare')}
          >
            <GitCompare size={14} color={colors.accent} />
            <Text style={styles.compareBtnText}>Compare</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>

      {/* AI Banner (collapsed) */}
      {!showAi && !aiResult && (
        <TouchableOpacity
          style={styles.aiBanner}
          onPress={() => setShowAi(true)}
          activeOpacity={0.85}
        >
          <View style={styles.aiBannerIcon}>
            <Sparkles size={20} color={colors.white} />
          </View>
          <View style={styles.aiBannerTextWrap}>
            <Text style={styles.aiBannerTitle}>Ask AI to find your perfect field</Text>
            <Text style={styles.aiBannerHint}>
              Try: "Cheap football in Tirana" or "Best rated courts"
            </Text>
          </View>
          <ChevronRight size={20} color={colors.primary} />
        </TouchableOpacity>
      )}

      {/* AI Search Panel (expanded) */}
      {showAi && !aiResult && (
        <View style={styles.aiPanel}>
          <View style={styles.aiPanelBar} />
          <View style={styles.aiPanelHeader}>
            <View style={styles.aiPanelHeaderLeft}>
              <View style={styles.aiPanelSmallIcon}>
                <Sparkles size={14} color={colors.white} />
              </View>
              <View>
                <Text style={styles.aiPanelTitle}>AI-Powered Search</Text>
                <Text style={styles.aiPanelDesc}>Describe what you're looking for</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setShowAi(false)}
              style={styles.aiCloseBtn}
            >
              <X size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <View style={styles.aiInputRow}>
            <View style={styles.aiInputWrap}>
              <Sparkles size={14} color={colors.primary + '66'} style={styles.aiInputIcon} />
              <TextInput
                style={styles.aiInput}
                value={aiPrompt}
                onChangeText={setAiPrompt}
                placeholder='"Cheap football fields in Tirana"...'
                placeholderTextColor={colors.mutedForeground}
                onSubmitEditing={handleAiSearch}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity
              style={[
                styles.aiSendBtn,
                (!aiPrompt.trim() || aiLoading) && styles.aiSendBtnDisabled,
              ]}
              onPress={handleAiSearch}
              disabled={!aiPrompt.trim() || aiLoading}
              activeOpacity={0.8}
            >
              {aiLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Send size={16} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.aiChipsScroll}
            contentContainerStyle={styles.aiChipsContent}
          >
            {AI_SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.aiChip}
                onPress={() => setAiPrompt(s)}
              >
                <Sparkles size={9} color={colors.mutedForeground} />
                <Text style={styles.aiChipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* AI Result Banner */}
      {aiResult && (
        <View style={styles.aiResultBanner}>
          <View style={styles.aiResultHeader}>
            <View style={styles.aiResultHeaderLeft}>
              <View style={styles.aiResultIcon}>
                <Sparkles size={14} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.aiResultTitle}>AI Recommendation</Text>
                <Text style={styles.aiResultQuery}>Based on: "{aiPrompt}"</Text>
              </View>
            </View>
            <TouchableOpacity onPress={clearAi} style={styles.aiCloseBtn}>
              <X size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
          <Text style={styles.aiResultMessage}>{aiResult.message}</Text>
          {aiResult.tags.length > 0 && (
            <View style={styles.aiTagsRow}>
              {aiResult.tags.map((tag) => (
                <View key={tag} style={styles.aiTag}>
                  <Text style={styles.aiTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Search Row + View Toggle */}
      {!aiResult && (
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search size={18} color={colors.mutedForeground} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search fields..."
              placeholderTextColor={colors.mutedForeground}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={[styles.iconBtn, showFilters && styles.iconBtnActive]}
            onPress={toggleFilters}
          >
            <SlidersHorizontal
              size={20}
              color={showFilters ? colors.background : colors.foreground}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))}
          >
            {viewMode === 'grid' ? (
              <List size={20} color={colors.foreground} />
            ) : (
              <LayoutGrid size={20} color={colors.foreground} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Filters Panel */}
      {showFilters && !aiResult && (
        <View style={styles.filtersPanel}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>City</Text>
            <View style={styles.chipRow}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[styles.chip, selectedCity === city && styles.chipActive]}
                  onPress={() => setSelectedCity(selectedCity === city ? '' : city)}
                >
                  <Text
                    style={[styles.chipText, selectedCity === city && styles.chipTextActive]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Sort by</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.chip, sortBy === 'rating' && styles.chipActive]}
                onPress={() => setSortBy('rating')}
              >
                <Text style={[styles.chipText, sortBy === 'rating' && styles.chipTextActive]}>
                  Rating
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, sortBy === 'price' && styles.chipActive]}
                onPress={() => setSortBy('price')}
              >
                <Text style={[styles.chipText, sortBy === 'price' && styles.chipTextActive]}>
                  Price
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => { clearSport(); clearCity(); }}
            >
              <X size={16} color={colors.destructive} />
              <Text style={styles.clearText}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Sport Chips */}
      {!aiResult && (
        <View style={styles.sportChips}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SPORTS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.sportChipsContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.sportChip,
                  selectedSport === item.id && styles.sportChipActive,
                ]}
                onPress={() =>
                  setSelectedSport(selectedSport === item.id ? '' : item.id)
                }
              >
                <Text
                  style={[
                    styles.sportChipText,
                    selectedSport === item.id && styles.sportChipTextActive,
                  ]}
                >
                  {item.emoji} {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsCount}>
          {displayFields.length} fields {aiResult ? 'recommended' : 'found'}
        </Text>
        {aiResult && (
          <TouchableOpacity onPress={clearAi} style={styles.clearAiBtn}>
            <Text style={styles.clearAiText}>Clear AI</Text>
            <X size={12} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Field List */}
      <FlatList
        data={displayFields}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Search size={40} color={colors.mutedForeground} />
            <Text style={styles.emptyText}>No fields found</Text>
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

  /* ── Header ── */
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: colors.accent + '1A',
    borderWidth: 1,
    borderColor: colors.accent + '33',
    marginTop: 4,
  },
  compareBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },

  /* ── AI Banner (collapsed) ── */
  aiBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.primary + '33',
    backgroundColor: colors.primary + '0D',
  },
  aiBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple500,
  },
  aiBannerTextWrap: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  aiBannerHint: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 2,
  },

  /* ── AI Panel (expanded) ── */
  aiPanel: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary + '33',
    backgroundColor: colors.primary + '0D',
    overflow: 'hidden',
  },
  aiPanelBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
  },
  aiPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiPanelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiPanelSmallIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple500,
  },
  aiPanelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  aiPanelDesc: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  aiCloseBtn: {
    padding: 4,
    borderRadius: 8,
  },
  aiInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  aiInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  aiInputIcon: {
    marginRight: 8,
  },
  aiInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 14,
    paddingVertical: 12,
  },
  aiSendBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple500,
  },
  aiSendBtnDisabled: {
    opacity: 0.4,
  },
  aiChipsScroll: {
    marginTop: 10,
  },
  aiChipsContent: {
    gap: 6,
  },
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary + '1A',
    backgroundColor: colors.white + '08',
  },
  aiChipText: {
    fontSize: 11,
    color: colors.mutedForeground,
  },

  /* ── AI Result Banner ── */
  aiResultBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary + '1A',
    backgroundColor: colors.card,
  },
  aiResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiResultHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiResultIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiResultTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  aiResultQuery: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  aiResultMessage: {
    fontSize: 13,
    color: colors.foreground,
    lineHeight: 18,
    marginBottom: 8,
  },
  aiTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  aiTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: colors.primary + '1A',
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },

  /* ── Search Row ── */
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
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
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  /* ── Filters Panel ── */
  filtersPanel: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
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
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  clearText: {
    fontSize: 13,
    color: colors.destructive,
    fontWeight: '600',
  },

  /* ── Sport Chips ── */
  sportChips: {
    marginBottom: 12,
  },
  sportChipsContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingRight: 20,
  },
  sportChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  sportChipActive: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
  },
  sportChipText: {
    fontSize: 13,
    color: colors.foreground,
  },
  sportChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  /* ── Results Bar ── */
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  clearAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearAiText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  /* ── Field List ── */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.mutedForeground,
  },

  /* ── Compact (List view) ── */
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
  },
  compactLeft: {
    flex: 1,
    gap: 4,
  },
  compactName: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '600',
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactLocation: {
    color: colors.mutedForeground,
    fontSize: 11,
  },
  compactRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  compactRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  compactPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
