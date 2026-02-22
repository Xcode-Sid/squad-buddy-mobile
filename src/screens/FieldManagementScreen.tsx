import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Pencil, Plus, ToggleLeft, ToggleRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { formatPrice } from '../utils/formatting';
import { FIELDS } from '../data/mockData';
import { SPORTS } from '../data/mockData';
import type { Field } from '../data/mockData';

const MANAGED_FIELDS = FIELDS.slice(0, 3);

function FieldCard({ field, onEdit, onToggle, index = 0 }: { field: Field; onEdit: () => void; onToggle: () => void; index?: number }) {
  const [active, setActive] = useState(true);
  const sport = SPORTS.find((s) => s.id === field.sports[0]);

  const handleToggle = () => {
    setActive(!active);
    onToggle();
  };

  return (
    <Animated.View entering={FadeInUp.delay(Math.min(index, 6) * 80).duration(500)} style={styles.card}>
      <Image source={{ uri: field.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={1}>{field.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.sportEmoji}>{sport?.emoji}</Text>
          <Text style={styles.sportName}>{sport?.name}</Text>
          <Text style={styles.price}>{formatPrice(field.pricePerHour)}/hr</Text>
        </View>
        <View style={styles.actions}>
          <AnimatedPressable style={styles.actionBtn} onPress={onEdit}>
            <Pencil size={16} color={colors.foreground} />
            <Text style={styles.actionText}>Edit</Text>
          </AnimatedPressable>
          <AnimatedPressable style={styles.actionBtn} onPress={handleToggle}>
            {active ? (
              <ToggleRight size={24} color={colors.primary} />
            ) : (
              <ToggleLeft size={24} color={colors.mutedForeground} />
            )}
            <Text style={styles.actionText}>{active ? 'Active' : 'Inactive'}</Text>
          </AnimatedPressable>
        </View>
      </View>
    </Animated.View>
  );
}

export default function FieldManagementScreen() {
  const handleAddField = () => {
    Alert.alert('Coming Soon', 'Add field functionality will be available soon.');
  };

  const handleEdit = (field: Field) => {
    Alert.alert('Coming Soon', `Edit ${field.name} will be available soon.`);
  };

  const handleToggle = () => {
    // Mock toggle
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Field Management</Text>
        <Text style={styles.subtitle}>Manage your fields</Text>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MANAGED_FIELDS.map((field, idx) => (
          <FieldCard
            key={field.id}
            field={field}
            index={idx}
            onEdit={() => handleEdit(field)}
            onToggle={handleToggle}
          />
        ))}

        <Animated.View entering={FadeInUp.springify().delay(320).duration(500)}>
          <AnimatedPressable style={styles.addBtn} onPress={handleAddField}>
            <Plus size={24} color={colors.primary} />
            <Text style={styles.addBtnText}>Add Field</Text>
          </AnimatedPressable>
        </Animated.View>

        <View style={styles.bottomSpacer} />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.muted,
  },
  cardContent: {
    padding: 14,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sportEmoji: {
    fontSize: 14,
  },
  sportName: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  price: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.muted,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomSpacer: {
    height: 24,
  },
});
