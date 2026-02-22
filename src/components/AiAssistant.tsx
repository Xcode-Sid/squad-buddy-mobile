import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView, Image,
  StyleSheet, Modal, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import Animated, { BounceIn } from 'react-native-reanimated';
import { Sparkles, Send, X, MapPin, Radio, Trophy, Users } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import AnimatedPressable from './AnimatedPressable';
import { FIELDS, SPORTS, LIVE_GAMES, TOURNAMENTS, PLAYERS } from '../data/mockData';
import { formatPrice } from '../utils/formatting';

interface SearchResult {
  type: 'field' | 'live' | 'tournament' | 'player' | 'tip';
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  screen: string;
  params?: any;
  badge?: string;
  badgeColor?: string;
}

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  results?: SearchResult[];
}

function generateAiResponse(query: string): { text: string; results: SearchResult[] } {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  const matchedSports = SPORTS.filter(s => q.includes(s.name.toLowerCase()) || q.includes(s.id));
  const sportIds = matchedSports.map(s => s.id);
  const cityMatch = ['tirana', 'durrës', 'durres', 'vlorë', 'vlore', 'shkodër', 'shkoder', 'elbasan', 'korçë', 'korce', 'fier', 'berat']
    .find(c => q.includes(c));

  if (q.includes('field') || q.includes('book') || q.includes('play') || q.includes('where') || sportIds.length > 0 || cityMatch) {
    FIELDS.filter(f => {
      const sm = sportIds.length === 0 || f.sports.some(s => sportIds.includes(s));
      const lm = !cityMatch || f.city.toLowerCase().includes(cityMatch);
      return (sm && lm) || f.name.toLowerCase().includes(q);
    }).slice(0, 4).forEach(f => {
      const sport = SPORTS.find(s => s.id === f.sports[0]);
      results.push({
        type: 'field', id: f.id, title: f.name,
        subtitle: `${f.city} · ${sport?.emoji ?? ''} · ${formatPrice(f.pricePerHour)}/hr · ★ ${f.rating}`,
        image: f.image, screen: 'FieldDetail', params: { id: f.id },
        badge: f.availability === 'available' ? 'Available' : f.availability === 'few-slots' ? 'Few Slots' : 'Booked',
        badgeColor: f.availability === 'available' ? colors.primary : f.availability === 'few-slots' ? colors.accent : colors.destructive,
      });
    });
  }

  if (q.includes('live') || q.includes('score') || q.includes('stream') || q.includes('watch') || q.includes('game')) {
    LIVE_GAMES.slice(0, 3).forEach(g => {
      results.push({
        type: 'live', id: g.id, title: `${g.teamA.name} vs ${g.teamB.name}`,
        subtitle: `Score: ${g.teamA.score}–${g.teamB.score} · ${g.sport}`,
        screen: 'LiveStream', params: { id: g.id }, badge: 'LIVE', badgeColor: colors.live,
      });
    });
  }

  if (q.includes('tournament') || q.includes('compete') || q.includes('cup')) {
    TOURNAMENTS.slice(0, 3).forEach(t => {
      const sport = SPORTS.find(s => s.id === t.sport);
      results.push({
        type: 'tournament', id: t.id, title: t.name,
        subtitle: `${sport?.emoji ?? ''} ${t.sport} · ${t.teamsCount} teams · ${t.prizePool}`,
        screen: 'Tournaments',
        badge: t.status === 'in-progress' ? 'LIVE' : t.status === 'registration' ? 'Open' : 'Done',
        badgeColor: t.status === 'in-progress' ? colors.live : t.status === 'registration' ? colors.accent : colors.mutedForeground,
      });
    });
  }

  if (q.includes('player') || q.includes('who') || q.includes('friend') || q.includes('teammate') || q.includes('squad')) {
    PLAYERS.slice(0, 4).forEach(p => {
      results.push({
        type: 'player', id: p.id, title: p.name,
        subtitle: `${p.location} · ${p.favoriteSport} · ${p.gamesPlayed} games · ★ ${p.rating}`,
        image: p.avatar, screen: 'Social',
      });
    });
  }

  let text = '';
  if (results.length > 0) {
    const parts: string[] = [];
    const fc = results.filter(r => r.type === 'field').length;
    const lc = results.filter(r => r.type === 'live').length;
    const tc = results.filter(r => r.type === 'tournament').length;
    const pc = results.filter(r => r.type === 'player').length;
    if (fc) parts.push(`${fc} field${fc > 1 ? 's' : ''}`);
    if (lc) parts.push(`${lc} live game${lc > 1 ? 's' : ''}`);
    if (tc) parts.push(`${tc} tournament${tc > 1 ? 's' : ''}`);
    if (pc) parts.push(`${pc} player${pc > 1 ? 's' : ''}`);
    text = `Here's what I found — ${parts.join(', ')}. Tap any result!`;
  } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    text = "Hey there! I'm your Squad Buddy AI assistant. Ask me things like:\n\n• \"Show me football fields in Tirana\"\n• \"What's live right now?\"\n• \"Find tournaments near me\"\n• \"Who are the top players?\"";
  } else if (q.includes('help') || q.includes('what can')) {
    text = "I can help you with:\n\n🏟️ Fields — Find and book sports fields\n📡 Live games — Check scores\n🏆 Tournaments — Browse competitions\n👥 Players — Discover teammates\n\nJust type naturally!";
  } else if (q.includes('price') || q.includes('cheap') || q.includes('cost')) {
    const sorted = [...FIELDS].sort((a, b) => a.pricePerHour - b.pricePerHour);
    sorted.slice(0, 3).forEach(f => {
      results.push({ type: 'field', id: f.id, title: f.name, subtitle: `${f.city} · ${formatPrice(f.pricePerHour)}/hr`, image: f.image, screen: 'FieldDetail', params: { id: f.id }, badge: 'Best Value', badgeColor: colors.primary });
    });
    text = `Here are the most affordable fields. Prices start from ${formatPrice(sorted[0].pricePerHour)}/hr!`;
  } else if (q.includes('best') || q.includes('top') || q.includes('rated')) {
    const sorted = [...FIELDS].sort((a, b) => b.rating - a.rating);
    sorted.slice(0, 4).forEach(f => {
      results.push({ type: 'field', id: f.id, title: f.name, subtitle: `${f.city} · ★ ${f.rating}`, image: f.image, screen: 'FieldDetail', params: { id: f.id }, badge: 'Top Rated', badgeColor: colors.accent });
    });
    text = `Top-rated fields! #1 is ${sorted[0].name} with ★ ${sorted[0].rating}.`;
  } else {
    const fuzzy = FIELDS.filter(f => f.name.toLowerCase().includes(q) || f.city.toLowerCase().includes(q) || f.sports.some(s => q.includes(s))).slice(0, 3);
    if (fuzzy.length > 0) {
      fuzzy.forEach(f => { results.push({ type: 'field', id: f.id, title: f.name, subtitle: `${f.city} · ${formatPrice(f.pricePerHour)}/hr`, image: f.image, screen: 'FieldDetail', params: { id: f.id } }); });
      text = `Found ${fuzzy.length} result${fuzzy.length > 1 ? 's' : ''} matching "${query}".`;
    } else {
      text = `I couldn't find results for "${query}". Try searching for a sport, city, or ask about live games!`;
    }
  }
  return { text, results };
}

const ICON_MAP: Record<string, any> = { field: MapPin, live: Radio, tournament: Trophy, player: Users, tip: Sparkles };

export default function AiAssistant() {
  const nav = useNavigation<any>();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'welcome', role: 'assistant', text: "Hey! I'm your Squad Buddy AI. Ask me anything — find fields, check live scores, discover players, or get recommendations.", results: [] },
  ]);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = useCallback(() => {
    const q = input.trim();
    if (!q) return;
    const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const { text, results } = generateAiResponse(q);
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text, results }]);
      setTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 500 + Math.random() * 700);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [input]);

  const navigateResult = (r: SearchResult) => {
    setOpen(false);
    nav.navigate(r.screen, r.params);
  };

  const suggestions = ['Football in Tirana', "What's live?", 'Best fields', 'Top players'];

  return (
    <>
      {/* FAB */}
      {!open && (
        <Animated.View entering={BounceIn.delay(500)}>
          <AnimatedPressable style={st.fab} onPress={() => setOpen(true)} scaleValue={0.9}>
            <Sparkles size={24} color={colors.primaryForeground} />
          </AnimatedPressable>
        </Animated.View>
      )}

      {/* Chat Modal */}
      <Modal visible={open} animationType="slide" transparent>
        <KeyboardAvoidingView style={st.modalWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={st.chatPanel}>
            {/* Header */}
            <View style={st.chatHeader}>
              <View style={st.chatHeaderLeft}>
                <View style={st.aiIcon}><Sparkles size={16} color={colors.primary} /></View>
                <View>
                  <Text style={st.chatHeaderTitle}>Squad Buddy AI</Text>
                  <Text style={st.chatHeaderSub}>Online · Ready to help</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setOpen(false)} style={st.closeBtn}>
                <X size={18} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView ref={scrollRef} style={st.msgScroll} contentContainerStyle={st.msgContent} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
              {messages.map(msg => (
                <View key={msg.id} style={[st.msgRow, msg.role === 'user' && st.msgRowUser]}>
                  {msg.role === 'user' ? (
                    <View style={st.userBubble}><Text style={st.userBubbleText}>{msg.text}</Text></View>
                  ) : (
                    <View style={st.aiBubbleWrap}>
                      <View style={st.aiBubble}><Text style={st.aiBubbleText}>{msg.text}</Text></View>
                      {msg.results && msg.results.length > 0 && (
                        <View style={st.resultsList}>
                          {msg.results.map(r => {
                            const Icon = ICON_MAP[r.type] ?? MapPin;
                            return (
                              <TouchableOpacity key={`${r.type}-${r.id}`} style={st.resultCard} onPress={() => navigateResult(r)} activeOpacity={0.8}>
                                {r.image ? (
                                  <Image source={{ uri: r.image }} style={st.resultImg} />
                                ) : (
                                  <View style={st.resultIconWrap}><Icon size={18} color={colors.mutedForeground} /></View>
                                )}
                                <View style={st.resultTextWrap}>
                                  <Text style={st.resultTitle} numberOfLines={1}>{r.title}</Text>
                                  <Text style={st.resultSub} numberOfLines={1}>{r.subtitle}</Text>
                                </View>
                                {r.badge && <Text style={[st.resultBadge, { color: r.badgeColor ?? colors.primary }]}>{r.badge}</Text>}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}
              {typing && (
                <View style={st.typingWrap}>
                  <View style={st.aiBubble}><Text style={st.aiBubbleText}>...</Text></View>
                </View>
              )}
            </ScrollView>

            {/* Quick suggestions */}
            {messages.length <= 2 && (
              <View style={st.suggestRow}>
                {suggestions.map(s => (
                  <TouchableOpacity key={s} style={st.suggestChip} onPress={() => { setInput(s); }}>
                    <Text style={st.suggestText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Input */}
            <View style={st.inputRow}>
              <TextInput
                style={st.inputField}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
                placeholder="Ask anything..."
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="send"
              />
              <TouchableOpacity style={[st.sendBtn, !input.trim() && { opacity: 0.4 }]} onPress={handleSend} disabled={!input.trim()}>
                <Send size={16} color={colors.primaryForeground} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const st = StyleSheet.create({
  fab: {
    position: 'absolute', bottom: 90, right: 16, width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  chatPanel: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%', flex: 1, borderWidth: 1, borderColor: colors.border },
  chatHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  chatHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary + '1A', alignItems: 'center', justifyContent: 'center' },
  chatHeaderTitle: { fontSize: 14, fontWeight: '700', color: colors.foreground },
  chatHeaderSub: { fontSize: 10, color: colors.primary },
  closeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  msgScroll: { flex: 1 },
  msgContent: { padding: 16, gap: 12 },
  msgRow: { alignItems: 'flex-start' },
  msgRowUser: { alignItems: 'flex-end' },
  userBubble: { backgroundColor: colors.primary, borderRadius: 16, borderBottomRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '85%' },
  userBubbleText: { color: colors.primaryForeground, fontSize: 13, lineHeight: 19 },
  aiBubbleWrap: { maxWidth: '90%', gap: 6 },
  aiBubble: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10 },
  aiBubbleText: { color: colors.foreground, fontSize: 13, lineHeight: 19 },
  resultsList: { gap: 4 },
  resultCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  resultImg: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.muted },
  resultIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  resultTextWrap: { flex: 1 },
  resultTitle: { fontSize: 12, fontWeight: '600', color: colors.foreground },
  resultSub: { fontSize: 9, color: colors.mutedForeground, marginTop: 1 },
  resultBadge: { fontSize: 9, fontWeight: '600' },
  typingWrap: { alignItems: 'flex-start' },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingBottom: 8 },
  suggestChip: { backgroundColor: colors.muted, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  suggestText: { fontSize: 11, color: colors.foreground, fontWeight: '500' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  inputField: { flex: 1, backgroundColor: colors.muted + '80', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: colors.foreground },
  sendBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
