import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal,
  FlatList, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronDown, Sparkles, Send, Trophy, CheckCircle, Minus,
  Zap, GitCompare,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { formatPrice } from '../utils/formatting';
import { FIELDS, PLAYERS, SPORTS } from '../data/mockData';

type CompareMode = 'fields' | 'players';

interface CompareResult {
  summary: string;
  winner: string;
  categories: { label: string; itemA: string; itemB: string; winner: 'a' | 'b' | 'tie' }[];
  verdict: string;
}

function compareFieldsAI(a: typeof FIELDS[0], b: typeof FIELDS[0]): CompareResult {
  const cats: CompareResult['categories'] = [];
  cats.push({ label: 'Rating', itemA: `${a.rating} ★ (${a.reviewCount})`, itemB: `${b.rating} ★ (${b.reviewCount})`, winner: a.rating > b.rating ? 'a' : a.rating < b.rating ? 'b' : 'tie' });
  cats.push({ label: 'Price/hr', itemA: formatPrice(a.pricePerHour), itemB: formatPrice(b.pricePerHour), winner: a.pricePerHour < b.pricePerHour ? 'a' : a.pricePerHour > b.pricePerHour ? 'b' : 'tie' });
  cats.push({ label: 'Peak Price', itemA: formatPrice(a.peakPricePerHour), itemB: formatPrice(b.peakPricePerHour), winner: a.peakPricePerHour < b.peakPricePerHour ? 'a' : a.peakPricePerHour > b.peakPricePerHour ? 'b' : 'tie' });
  cats.push({ label: 'Sports', itemA: a.sports.map(s => SPORTS.find(sp => sp.id === s)?.emoji ?? s).join(' '), itemB: b.sports.map(s => SPORTS.find(sp => sp.id === s)?.emoji ?? s).join(' '), winner: a.sports.length > b.sports.length ? 'a' : a.sports.length < b.sports.length ? 'b' : 'tie' });
  cats.push({ label: 'Amenities', itemA: `${a.amenities.length} amenities`, itemB: `${b.amenities.length} amenities`, winner: a.amenities.length > b.amenities.length ? 'a' : a.amenities.length < b.amenities.length ? 'b' : 'tie' });
  cats.push({ label: 'Surface', itemA: a.surface, itemB: b.surface, winner: 'tie' });
  cats.push({ label: 'Type', itemA: a.indoor ? 'Indoor' : 'Outdoor', itemB: b.indoor ? 'Indoor' : 'Outdoor', winner: 'tie' });
  cats.push({ label: 'City', itemA: a.city, itemB: b.city, winner: 'tie' });

  const aW = cats.filter(c => c.winner === 'a').length;
  const bW = cats.filter(c => c.winner === 'b').length;
  const winner = aW > bW ? a.name : bW > aW ? b.name : 'Tie';
  const verdict = aW > bW
    ? `${a.name} edges out with better rating and value. Wins ${aW} categories vs ${bW}.`
    : bW > aW
    ? `${b.name} takes the lead with ${bW} wins across categories.`
    : `Close match! Both fields are equally competitive. Choose based on location and sport.`;

  return { summary: `Comparing ${a.name} vs ${b.name} across ${cats.length} categories`, winner, categories: cats, verdict };
}

function comparePlayersAI(a: typeof PLAYERS[0], b: typeof PLAYERS[0]): CompareResult {
  const cats: CompareResult['categories'] = [];
  cats.push({ label: 'Rating', itemA: `${a.rating} ★`, itemB: `${b.rating} ★`, winner: a.rating > b.rating ? 'a' : a.rating < b.rating ? 'b' : 'tie' });
  cats.push({ label: 'Games', itemA: String(a.gamesPlayed), itemB: String(b.gamesPlayed), winner: a.gamesPlayed > b.gamesPlayed ? 'a' : a.gamesPlayed < b.gamesPlayed ? 'b' : 'tie' });
  cats.push({ label: 'Win Rate', itemA: `${a.winRate}%`, itemB: `${b.winRate}%`, winner: a.winRate > b.winRate ? 'a' : a.winRate < b.winRate ? 'b' : 'tie' });
  cats.push({ label: 'Hours', itemA: `${a.totalHours}h`, itemB: `${b.totalHours}h`, winner: a.totalHours > b.totalHours ? 'a' : a.totalHours < b.totalHours ? 'b' : 'tie' });
  cats.push({ label: 'Sports', itemA: a.sports.map(s => SPORTS.find(sp => sp.id === s)?.emoji ?? s).join(' '), itemB: b.sports.map(s => SPORTS.find(sp => sp.id === s)?.emoji ?? s).join(' '), winner: a.sports.length > b.sports.length ? 'a' : a.sports.length < b.sports.length ? 'b' : 'tie' });
  cats.push({ label: 'Location', itemA: a.location, itemB: b.location, winner: 'tie' });

  const aW = cats.filter(c => c.winner === 'a').length;
  const bW = cats.filter(c => c.winner === 'b').length;
  const winner = aW > bW ? a.name : bW > aW ? b.name : 'Tie';
  const verdict = aW > bW
    ? `${a.name} is the stronger player with ${aW} category wins.`
    : bW > aW
    ? `${b.name} comes out on top with ${bW} category wins.`
    : `Both players are evenly matched! Exciting head-to-head.`;

  return { summary: `Head-to-head: ${a.name} vs ${b.name} across ${cats.length} categories`, winner, categories: cats, verdict };
}

function aiCompareFromPrompt(prompt: string, mode: CompareMode) {
  const q = prompt.toLowerCase();
  const items = mode === 'fields' ? FIELDS : PLAYERS;
  const matched: any[] = [];
  for (const item of items) {
    if (q.includes(item.name.toLowerCase()) || q.includes(item.name.split(' ')[0].toLowerCase())) {
      if (!matched.find(m => m.id === item.id)) matched.push(item);
    }
  }
  if (matched.length < 2) {
    if (q.includes('best') && q.includes('worst')) {
      const sorted = [...items].sort((a: any, b: any) => b.rating - a.rating);
      return { itemA: sorted[0], itemB: sorted[sorted.length - 1] };
    }
    if (q.includes('top') || q.includes('best')) {
      const sorted = [...items].sort((a: any, b: any) => b.rating - a.rating);
      return { itemA: sorted[0], itemB: sorted[1] };
    }
    if (q.includes('cheap') && mode === 'fields') {
      const sorted = [...FIELDS].sort((a, b) => a.pricePerHour - b.pricePerHour);
      return { itemA: sorted[0], itemB: sorted[1] };
    }
    return null;
  }
  return { itemA: matched[0], itemB: matched[1] };
}

export default function CompareScreen() {
  const [mode, setMode] = useState<CompareMode>('fields');
  const [selA, setSelA] = useState('');
  const [selB, setSelB] = useState('');
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [pickerFor, setPickerFor] = useState<'a' | 'b' | null>(null);

  const items = mode === 'fields' ? FIELDS : PLAYERS;
  const nameA = items.find(i => i.id === selA)?.name ?? '';
  const nameB = items.find(i => i.id === selB)?.name ?? '';

  const runCompare = useCallback(() => {
    if (!selA || !selB || selA === selB) return;
    setLoading(true);
    setTimeout(() => {
      if (mode === 'fields') {
        const a = FIELDS.find(f => f.id === selA), b = FIELDS.find(f => f.id === selB);
        if (a && b) setResult(compareFieldsAI(a, b));
      } else {
        const a = PLAYERS.find(p => p.id === selA), b = PLAYERS.find(p => p.id === selB);
        if (a && b) setResult(comparePlayersAI(a, b));
      }
      setLoading(false);
    }, 500);
  }, [selA, selB, mode]);

  const runAiCompare = useCallback(() => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const res = aiCompareFromPrompt(aiPrompt, mode);
      if (res) {
        setSelA(res.itemA.id);
        setSelB(res.itemB.id);
        const r = mode === 'fields'
          ? compareFieldsAI(res.itemA, res.itemB)
          : comparePlayersAI(res.itemA, res.itemB);
        setResult(r);
      } else {
        setResult({
          summary: "Couldn't find two matching items from your prompt.",
          winner: 'N/A',
          categories: [],
          verdict: `Try mentioning two specific ${mode === 'fields' ? 'field' : 'player'} names, or say "compare the top 2" or "best vs worst".`,
        });
      }
      setLoading(false);
      setAiPrompt('');
    }, 600);
  }, [aiPrompt, mode]);

  const switchMode = (m: CompareMode) => {
    setMode(m);
    setResult(null);
    setSelA('');
    setSelB('');
  };

  const suggestions = mode === 'fields'
    ? ['Compare top 2 fields', 'Best vs worst', 'Cheapest fields']
    : ['Compare top 2 players', 'Best vs worst', 'Andi vs Elira'];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={s.header}>
        <View style={s.headerRow}>
          <BackButton />
          <GitCompare size={18} color={colors.primary} />
          <Text style={s.title}>AI Compare</Text>
        </View>

        {/* Mode Toggle */}
        <View style={s.modeRow}>
          {(['fields', 'players'] as CompareMode[]).map(m => (
            <AnimatedPressable key={m} style={[s.modeBtn, mode === m && s.modeBtnActive]} onPress={() => switchMode(m)}>
              <Text style={[s.modeBtnText, mode === m && s.modeBtnTextActive]}>
                {m === 'fields' ? '🏟️ Fields' : '👤 Players'}
              </Text>
            </AnimatedPressable>
          ))}
        </View>

        {/* AI Prompt */}
        <View style={s.aiBanner}>
          <View style={s.aiHeader}>
            <Sparkles size={14} color={colors.primary} />
            <Text style={s.aiTitle}>AI Compare</Text>
            <Text style={s.aiSubtitle}>Type a prompt or select below</Text>
          </View>
          <View style={s.aiInputRow}>
            <TextInput
              style={s.aiInput}
              value={aiPrompt}
              onChangeText={setAiPrompt}
              onSubmitEditing={runAiCompare}
              placeholder={mode === 'fields' ? 'e.g. "Compare Arena Sport vs Tennis Club"' : 'e.g. "Compare Andi vs Elira"'}
              placeholderTextColor={colors.mutedForeground}
              returnKeyType="send"
            />
            <AnimatedPressable style={[s.aiSendBtn, !aiPrompt.trim() && { opacity: 0.4 }]} onPress={runAiCompare} disabled={!aiPrompt.trim() || loading}>
              <Send size={14} color={colors.primaryForeground} />
            </AnimatedPressable>
          </View>
          <View style={s.chipRow}>
            {suggestions.map(sug => (
              <AnimatedPressable key={sug} style={s.chip} onPress={() => setAiPrompt(sug)}>
                <Text style={s.chipText}>{sug}</Text>
              </AnimatedPressable>
            ))}
          </View>
        </View>
      </Animated.View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Manual Pickers */}
        <Animated.View entering={FadeInRight.duration(500)} style={s.pickerRow}>
          {(['a', 'b'] as const).map(slot => {
            const val = slot === 'a' ? selA : selB;
            const name = slot === 'a' ? nameA : nameB;
            return (
              <View key={slot} style={s.pickerWrap}>
                <Text style={s.pickerLabel}>{mode === 'fields' ? 'Field' : 'Player'} {slot.toUpperCase()}</Text>
                <TouchableOpacity style={s.picker} onPress={() => setPickerFor(slot)}>
                  <Text style={[s.pickerText, !val && s.pickerPlaceholder]} numberOfLines={1}>
                    {name || 'Select...'}
                  </Text>
                  <ChevronDown size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            );
          })}
        </Animated.View>

        {/* Compare Button */}
        <Animated.View entering={FadeInUp.springify().delay(100).duration(500)}>
          <AnimatedPressable
            style={[s.compareBtn, (!selA || !selB || selA === selB) && { opacity: 0.3 }]}
            onPress={runCompare}
            disabled={!selA || !selB || selA === selB || loading}
          >
            {loading ? <ActivityIndicator size="small" color={colors.primaryForeground} /> : <GitCompare size={16} color={colors.primaryForeground} />}
            <Text style={s.compareBtnText}>{loading ? 'Analyzing...' : 'Compare'}</Text>
          </AnimatedPressable>
        </Animated.View>

        {/* Results */}
        {result && (
          <View style={s.results}>
            {/* Summary */}
            <Animated.View entering={FadeInUp.delay(0).duration(500)} style={s.summaryCard}>
              <View style={s.aiHeader}>
                <Sparkles size={14} color={colors.primary} />
                <Text style={s.aiTitle}>AI Analysis</Text>
              </View>
              <Text style={s.summaryText}>{result.summary}</Text>
              {result.winner !== 'N/A' && (
                <View style={s.winnerRow}>
                  <Trophy size={14} color={colors.accent} />
                  <Text style={s.winnerText}>Winner: {result.winner}</Text>
                </View>
              )}
            </Animated.View>

            {/* Category Breakdown */}
            {result.categories.length > 0 && (
              <Animated.View entering={FadeInUp.delay(80).duration(500)} style={s.breakdownCard}>
                <View style={s.breakdownHeader}>
                  <Text style={s.breakdownTitle}>HEAD-TO-HEAD</Text>
                  <View style={s.breakdownNames}>
                    <Text style={[s.breakdownName, { color: colors.primary }]}>{nameA}</Text>
                    <Text style={[s.breakdownName, { color: colors.accent }]}>{nameB}</Text>
                  </View>
                </View>
                {result.categories.map((cat, i) => (
                  <Animated.View entering={FadeInUp.delay(Math.min(i, 6) * 60).duration(400)} key={cat.label} style={s.catRow}>
                    <Text style={s.catLabel}>{cat.label}</Text>
                    <View style={s.catValues}>
                      <Text style={[s.catVal, cat.winner === 'a' && s.catWinA]} numberOfLines={1}>
                        {cat.itemA} {cat.winner === 'a' ? '✓' : ''}
                      </Text>
                      <View style={s.catDivider}>
                        {cat.winner === 'tie'
                          ? <Minus size={10} color={colors.mutedForeground} />
                          : <Zap size={10} color={cat.winner === 'a' ? colors.primary : colors.accent} />
                        }
                      </View>
                      <Text style={[s.catVal, cat.winner === 'b' && s.catWinB]} numberOfLines={1}>
                        {cat.itemB} {cat.winner === 'b' ? '✓' : ''}
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </Animated.View>
            )}

            {/* Score Bar */}
            {result.categories.length > 0 && (() => {
              const aW = result.categories.filter(c => c.winner === 'a').length;
              const ties = result.categories.filter(c => c.winner === 'tie').length;
              const bW = result.categories.filter(c => c.winner === 'b').length;
              const total = result.categories.length;
              return (
                <Animated.View entering={FadeInUp.delay(160).duration(500)} style={s.scoreCard}>
                  <Text style={s.scoreTitle}>SCORE</Text>
                  <View style={s.scoreRow}>
                    <Text style={[s.scoreNum, { color: colors.primary }]}>{aW}</Text>
                    <View style={s.scoreBarWrap}>
                      <View style={[s.scoreBar, { flex: aW, backgroundColor: colors.primary }]} />
                      <View style={[s.scoreBar, { flex: ties || 0.01, backgroundColor: colors.muted }]} />
                      <View style={[s.scoreBar, { flex: bW, backgroundColor: colors.accent }]} />
                    </View>
                    <Text style={[s.scoreNum, { color: colors.accent }]}>{bW}</Text>
                  </View>
                  <View style={s.scoreLabels}>
                    <Text style={s.scoreLabelText}>{nameA}</Text>
                    <Text style={s.scoreLabelText}>{ties} ties</Text>
                    <Text style={s.scoreLabelText}>{nameB}</Text>
                  </View>
                </Animated.View>
              );
            })()}

            {/* Verdict */}
            <Animated.View entering={FadeInUp.delay(240).duration(500)} style={s.verdictCard}>
              <View style={s.aiHeader}>
                <Trophy size={14} color={colors.accent} />
                <Text style={s.aiTitle}>AI Verdict</Text>
              </View>
              <Text style={s.verdictText}>{result.verdict}</Text>
            </Animated.View>
          </View>
        )}
      </ScrollView>

      {/* Picker Modal */}
      <Modal visible={pickerFor !== null} transparent animationType="fade">
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setPickerFor(null)}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Select {mode === 'fields' ? 'field' : 'player'}</Text>
            <FlatList
              data={items as any[]}
              keyExtractor={(item: any) => item.id}
              style={s.optionList}
              renderItem={({ item }: { item: any }) => (
                <TouchableOpacity style={s.option} onPress={() => {
                  if (pickerFor === 'a') setSelA(item.id);
                  else setSelB(item.id);
                  setPickerFor(null);
                  setResult(null);
                }}>
                  <Text style={s.optionText}>{item.name}</Text>
                  <Text style={s.optionSub}>
                    {item.city ? `${item.city} • ` : ''}
                    {item.location && !item.city ? `${item.location} • ` : ''}
                    {item.rating ? `${item.rating} ★` : ''}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700', color: colors.foreground },
  modeRow: { flexDirection: 'row', gap: 4, backgroundColor: colors.muted + '50', borderRadius: 12, padding: 3, marginBottom: 12 },
  modeBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.card, elevation: 1 },
  modeBtnText: { fontSize: 12, fontWeight: '500', color: colors.mutedForeground },
  modeBtnTextActive: { color: colors.foreground },
  aiBanner: { backgroundColor: colors.primary + '0D', borderWidth: 1, borderColor: colors.primary + '33', borderRadius: 14, padding: 12 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  aiTitle: { fontSize: 12, fontWeight: '700', color: colors.foreground },
  aiSubtitle: { fontSize: 9, color: colors.mutedForeground, marginLeft: 'auto' },
  aiInputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  aiInput: { flex: 1, backgroundColor: colors.muted + '80', borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 12, color: colors.foreground },
  aiSendBtn: { backgroundColor: colors.primary, width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: colors.muted + '80', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  chipText: { fontSize: 9, color: colors.mutedForeground },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  pickerRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  pickerWrap: { flex: 1 },
  pickerLabel: { fontSize: 10, fontWeight: '600', color: colors.mutedForeground, marginBottom: 6 },
  picker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border },
  pickerText: { fontSize: 12, color: colors.foreground, flex: 1 },
  pickerPlaceholder: { color: colors.mutedForeground },
  compareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 14, marginBottom: 16 },
  compareBtnText: { color: colors.primaryForeground, fontSize: 14, fontWeight: '700' },
  results: { gap: 12 },
  summaryCard: { backgroundColor: colors.primary + '0D', borderWidth: 1, borderColor: colors.primary + '33', borderRadius: 16, padding: 14 },
  summaryText: { fontSize: 13, color: colors.foreground, lineHeight: 20, marginTop: 4 },
  winnerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  winnerText: { fontSize: 13, fontWeight: '700', color: colors.accent },
  breakdownCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: 'hidden' },
  breakdownHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  breakdownTitle: { fontSize: 9, fontWeight: '700', color: colors.mutedForeground, letterSpacing: 1 },
  breakdownNames: { flexDirection: 'row', gap: 16 },
  breakdownName: { fontSize: 10, fontWeight: '700' },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border + '50' },
  catLabel: { width: 65, fontSize: 10, color: colors.mutedForeground, fontWeight: '500' },
  catValues: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  catVal: { flex: 1, fontSize: 11, color: colors.foreground },
  catWinA: { color: colors.primary, fontWeight: '700' },
  catWinB: { color: colors.accent, fontWeight: '700' },
  catDivider: { width: 20, alignItems: 'center' },
  scoreCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14 },
  scoreTitle: { fontSize: 9, fontWeight: '700', color: colors.mutedForeground, letterSpacing: 1, marginBottom: 10 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreNum: { fontSize: 14, fontWeight: '800' },
  scoreBarWrap: { flex: 1, flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' },
  scoreBar: { height: 10 },
  scoreLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  scoreLabelText: { fontSize: 9, color: colors.mutedForeground },
  verdictCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.accent + '33', borderRadius: 16, padding: 14 },
  verdictText: { fontSize: 13, color: colors.mutedForeground, lineHeight: 20, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: colors.card, borderRadius: 16, maxHeight: 400, borderWidth: 1, borderColor: colors.border },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.foreground, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionList: { maxHeight: 320 },
  option: { padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionText: { fontSize: 14, fontWeight: '600', color: colors.foreground },
  optionSub: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
});
