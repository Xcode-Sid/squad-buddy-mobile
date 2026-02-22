import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Search, ChevronDown, ChevronUp, Send } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { MOCK_FAQS, FAQ_CATEGORIES } from '../data/faqData';
import type { FaqItem, FaqCategory } from '../data/faqData';

const MOCK_AI_RESPONSES = [
  "I'd be happy to help! Could you tell me more about your booking issue?",
  "For field bookings, go to Explore > select a field > choose date and time > complete payment.",
  "Refunds are processed within 24 hours to your Squad Buddy wallet.",
  "You can cancel up to 24 hours before your booking for a full refund.",
];

function FaqAccordionItem({ item, expanded, onToggle }: { item: FaqItem; expanded: boolean; onToggle: () => void }) {
  return (
    <View style={styles.faqCard}>
      <TouchableOpacity style={styles.faqHeader} onPress={onToggle} activeOpacity={0.7}>
        <Text style={styles.faqQuestion} numberOfLines={expanded ? 10 : 2}>
          {item.question}
        </Text>
        {expanded ? (
          <ChevronUp size={20} color={colors.mutedForeground} />
        ) : (
          <ChevronDown size={20} color={colors.mutedForeground} />
        )}
      </TouchableOpacity>
      {expanded && (
        <View style={styles.faqAnswerWrap}>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
          <Text style={styles.faqHelpful}>{item.helpful} found this helpful</Text>
        </View>
      )}
    </View>
  );
}

export default function HelpCenterScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | ''>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  const filteredFaqs = MOCK_FAQS.filter((item) => {
    const matchSearch =
      !search ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: 'user', text: chatInput.trim() }]);
    setChatInput('');
    const mockReply = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: 'ai', text: mockReply }]);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Help Center</Text>
        <Text style={styles.subtitle}>FAQ & AI Assistant</Text>
      </Animated.View>

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color={colors.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catContent}
      >
        {FAQ_CATEGORIES.map((c, i) => (
          <Animated.View key={c.id} entering={FadeInRight.delay(i * 80).duration(400)}>
            <TouchableOpacity
              style={[styles.catChip, selectedCategory === c.id && styles.catChipActive]}
              onPress={() => setSelectedCategory(selectedCategory === c.id ? '' : c.id)}
            >
              <Text style={[styles.catChipText, selectedCategory === c.id && styles.catChipTextActive]}>
                {c.emoji} {c.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <Animated.View entering={FadeInUp.duration(500)}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      </Animated.View>

      <View style={styles.faqListContent}>
        {filteredFaqs.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No FAQs found</Text>
          </View>
        ) : (
          filteredFaqs.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInUp.delay(Math.min(index, 6) * 80).duration(500)}>
              <FaqAccordionItem
                item={item}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              />
            </Animated.View>
          ))
        )}
      </View>

      <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.chatSection}>
        <Text style={styles.chatSectionTitle}>AI Assistant</Text>
        <ScrollView style={styles.chatMessages} contentContainerStyle={styles.chatMessagesContent}>
          {chatMessages.length === 0 && (
            <Text style={styles.chatPlaceholder}>Ask me anything about bookings, payments, or account...</Text>
          )}
          {chatMessages.map((m, i) => (
            <View
              key={i}
              style={[styles.chatBubble, m.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleAi]}
            >
              <Text style={styles.chatBubbleText}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder="Type your question..."
            placeholderTextColor={colors.mutedForeground}
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={sendMessage}
          />
          <AnimatedPressable style={styles.sendBtn} onPress={sendMessage}>
            <Send size={18} color={colors.primaryForeground} />
          </AnimatedPressable>
        </View>
      </Animated.View>
      </ScrollView>
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
  catScroll: {
    marginBottom: 16,
  },
  catContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingRight: 20,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
  },
  catChipText: {
    fontSize: 13,
    color: colors.foreground,
  },
  catChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  faqListContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  faqCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
    marginRight: 8,
  },
  faqAnswerWrap: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 22,
  },
  faqHelpful: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  empty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.mutedForeground,
  },
  chatSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  chatMessages: {
    maxHeight: 120,
    marginBottom: 12,
  },
  chatMessagesContent: {
    paddingBottom: 8,
  },
  chatPlaceholder: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
  chatBubble: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  chatBubbleAi: {
    backgroundColor: colors.muted,
  },
  chatBubbleText: {
    fontSize: 14,
    color: colors.foreground,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.muted,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.foreground,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
