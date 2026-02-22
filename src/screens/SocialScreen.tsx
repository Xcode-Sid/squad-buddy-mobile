import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPlus, Check, X, UserMinus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { PLAYERS } from '../data/mockData';
import { useFriends } from '../hooks/useFriends';
import { useAuth } from '../context/AuthContext';
import type { IndividualProfile } from '../types/auth';
import type { Player } from '../data/mockData';

const SPORTS: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
  padel: '🏓',
  swimming: '🏊',
  volleyball: '🏐',
  futsal: '⚽',
  badminton: '🏸',
  rugby: '🏈',
  handball: '🤾',
  'beach-volleyball': '🏐',
  cricket: '🏏',
  baseball: '⚾',
  hockey: '🏑',
  golf: '⛳',
  boxing: '🥊',
  mma: '🤼',
  'table-tennis': '🏓',
};

export default function SocialScreen() {
  const nav = useNavigation();
  const { user } = useAuth();
  const profile = user?.role === 'individual' ? (user as IndividualProfile) : null;
  const mapId = (id: string) => id.replace('player-', '');
  const teammates = (profile?.friends ?? ['player-2', 'player-3']).map(mapId);
  const invites = (profile?.pendingFriends ?? ['player-4']).map(mapId);
  const scouted = (profile?.sentRequests ?? ['player-5']).map(mapId);

  const { getStatus, sendRequest, acceptRequest, rejectRequest, release } = useFriends(
    teammates,
    invites,
    scouted
  );

  const [activeTab, setActiveTab] = React.useState<'teammates' | 'scout'>('teammates');

  const teammatesList = useMemo(
    () => PLAYERS.filter((p) => getStatus(p.id) === 'teammate'),
    [getStatus]
  );
  const scoutList = useMemo(
    () =>
      activeTab === 'scout'
        ? PLAYERS.filter((p) => getStatus(p.id) !== 'teammate').slice(0, 12)
        : [],
    [activeTab, getStatus]
  );
  const displayList = activeTab === 'teammates' ? teammatesList : scoutList;

  const renderAction = (player: Player) => {
    const status = getStatus(player.id);
    if (status === 'teammate') {
      return (
        <AnimatedPressable
          style={styles.btnRelease}
          onPress={() => release(player.id)}
        >
          <UserMinus size={16} color={colors.destructive} />
          <Text style={styles.btnReleaseText}>Release</Text>
        </AnimatedPressable>
      );
    }
    if (status === 'invite_received') {
      return (
        <View style={styles.btnRow}>
          <AnimatedPressable
            style={styles.btnAccept}
            onPress={() => acceptRequest(player.id)}
          >
            <Check size={16} color={colors.primaryForeground} />
            <Text style={styles.btnAcceptText}>Accept</Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={styles.btnReject}
            onPress={() => rejectRequest(player.id)}
          >
            <X size={16} color={colors.destructive} />
          </AnimatedPressable>
        </View>
      );
    }
    if (status === 'scouted') {
      return (
        <View style={styles.btnPending}>
          <Text style={styles.btnPendingText}>Pending</Text>
        </View>
      );
    }
    return (
      <AnimatedPressable
        style={styles.btnRecruit}
        onPress={() => sendRequest(player.id)}
      >
        <UserPlus size={16} color={colors.primaryForeground} />
        <Text style={styles.btnRecruitText}>Recruit</Text>
      </AnimatedPressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Squad</Text>
        <Text style={styles.subtitle}>Manage teammates & discover players</Text>
      </Animated.View>

      <View style={styles.tabs}>
        <AnimatedPressable
          style={[styles.tab, activeTab === 'teammates' && styles.tabActive]}
          onPress={() => setActiveTab('teammates')}
        >
          <Text style={[styles.tabText, activeTab === 'teammates' && styles.tabTextActive]}>
            Teammates ({teammatesList.length})
          </Text>
        </AnimatedPressable>
        <AnimatedPressable
          style={[styles.tab, activeTab === 'scout' && styles.tabActive]}
          onPress={() => setActiveTab('scout')}
        >
          <Text style={[styles.tabText, activeTab === 'scout' && styles.tabTextActive]}>
            Scout
          </Text>
        </AnimatedPressable>
      </View>

      <FlatList
        data={displayList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(Math.min(index, 6) * 80).duration(500)} style={styles.card}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.cardContent}>
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.playerSport}>
                {SPORTS[item.favoriteSport] || '🏃'} {item.favoriteSport}
              </Text>
              <View style={styles.stats}>
                <Text style={styles.stat}>{item.gamesPlayed} games</Text>
                <Text style={styles.stat}>•</Text>
                <Text style={styles.stat}>{item.winRate}% win</Text>
                <Text style={styles.stat}>•</Text>
                <Text style={styles.stat}>{item.rating} ★</Text>
              </View>
              {renderAction(item)}
            </View>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {activeTab === 'teammates' ? 'No teammates yet. Scout players!' : 'No players to discover'}
            </Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary + '1A',
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  tabTextActive: {
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  playerSport: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 10,
  },
  stat: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  btnRecruit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnRecruitText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  btnAccept: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnAcceptText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  btnReject: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.destructive + '2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  btnRelease: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.destructive,
  },
  btnReleaseText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.destructive,
  },
  btnPending: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.muted,
  },
  btnPendingText: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.mutedForeground,
  },
});
