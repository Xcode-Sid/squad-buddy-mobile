import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Send } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const getReply = (text: string): string => {
  const q = text.toLowerCase();
  if (q.includes('user')) return 'You have 30 active users. 5 new signups this week. Top users: Andi Hoxha, Elira Murati, Dritan Leka.';
  if (q.includes('revenue')) return 'Total platform revenue: 4.12M ALL this month. Up 12% from last month. Top earners: Arena Sport Tirana, Kompleksi Dinamo.';
  if (q.includes('live')) return '5 live games currently running. FC Tirana vs KF Vllaznia has 1,234 viewers.';
  if (q.includes('field')) return '20 active fields listed. 3 new this month. Top rated: Padel Club Durrës (4.9).';
  if (q.includes('tournament')) return '5 tournaments: 2 in progress, 1 in registration, 2 completed.';
  if (q.includes('report')) return '5 pending reports: 2 high, 2 medium, 1 low severity.';
  if (q.includes('sport')) return 'Most popular sports: Football, Basketball, Padel, Tennis. 18 sports supported.';
  return 'I can help with users, revenue, live games, fields, tournaments, reports, or sports. What would you like to know?';
};

export default function AdminAIScreen() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: "Hello! I'm your admin assistant. Ask about users, revenue, live games, fields, tournaments, reports, or sports." },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }, { role: 'assistant', text: getReply(q) }]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Sparkles size={20} color={colors.accent} />
        <Text style={s.title}>Admin AI Assistant</Text>
      </View>

      <ScrollView ref={scrollRef} style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {messages.map((msg, i) => (
          <View key={i} style={[s.bubble, msg.role === 'user' ? s.bubbleUser : s.bubbleAI]}>
            <Text style={msg.role === 'user' ? s.textUser : s.textAI}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={s.inputRow}>
        <TextInput style={s.input} value={input} onChangeText={setInput} onSubmitEditing={send} placeholder="Ask about users, revenue, live, fields..." placeholderTextColor={colors.mutedForeground} returnKeyType="send" />
        <TouchableOpacity style={[s.sendBtn, !input.trim() && { opacity: 0.4 }]} onPress={send} disabled={!input.trim()}>
          <Send size={18} color={colors.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 18, fontWeight: '700', color: colors.foreground },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 8, gap: 8 },
  bubble: { padding: 12, borderRadius: 14, maxWidth: '85%', marginBottom: 4 },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: colors.primary + '30', borderBottomRightRadius: 4 },
  bubbleAI: { alignSelf: 'flex-start', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  textUser: { fontSize: 13, color: colors.foreground, lineHeight: 19 },
  textAI: { fontSize: 13, color: colors.foreground, lineHeight: 19 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, fontSize: 14, color: colors.foreground, backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: colors.border },
  sendBtn: { backgroundColor: colors.primary, padding: 10, borderRadius: 10 },
});
