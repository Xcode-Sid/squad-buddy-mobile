import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInRight, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CheckCheck } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { NOTIFICATIONS } from '../data/mockData';
import BackButton from '../components/BackButton';

export default function NotificationsScreen() {
  const nav = useNavigation<any>();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const renderNotification = ({ item, index }: { item: (typeof NOTIFICATIONS)[0]; index: number }) => (
    <Animated.View
      entering={FadeInRight.delay(Math.min(index, 6) * 60).springify()}
      style={[
        styles.card,
        !item.read && styles.cardUnread,
      ]}
    >
      <View style={styles.cardLeft}>
        {!item.read && <View style={styles.unreadDot} />}
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}>
            {item.title}
          </Text>
          <Text style={styles.cardMessage}>{item.message}</Text>
          <Text style={styles.cardTime}>{item.time}</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <Animated.View entering={FadeIn.delay(300)}>
            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={markAllRead}
              activeOpacity={0.85}
            >
              <CheckCheck size={18} color={colors.secondary} />
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.foreground, marginLeft: 12 },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12 },
  markAllText: { fontSize: 14, fontWeight: '600', color: colors.secondary },
  listContent: { padding: 16, paddingBottom: 24 },
  card: {
    padding: 16, borderRadius: 14, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, marginBottom: 10,
  },
  cardUnread: { backgroundColor: colors.muted + '40', borderColor: colors.secondary + '30' },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start' },
  unreadDot: {
    position: 'absolute', left: 0, top: 8, width: 8, height: 8,
    borderRadius: 4, backgroundColor: colors.secondary,
  },
  emoji: { fontSize: 24, marginRight: 12 },
  cardBody: { flex: 1, marginLeft: 4 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.foreground, marginBottom: 4 },
  cardTitleUnread: { fontWeight: '700' },
  cardMessage: { fontSize: 14, color: colors.mutedForeground, lineHeight: 20 },
  cardTime: { fontSize: 12, color: colors.mutedForeground, marginTop: 6 },
  empty: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { fontSize: 15, color: colors.mutedForeground },
});
