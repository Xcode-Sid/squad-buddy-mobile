import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Heart, MessageCircle, Share2, Users, Calendar, Trophy, MapPin, Plus,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { PLAYERS, SPORTS, FIELDS } from '../data/mockData';

type Tab = 'feed' | 'groups' | 'events' | 'leaderboard';

const MOCK_POSTS = [
  { id: 'p1', author: PLAYERS[0], content: 'Just booked Arena Kombetare for Friday evening! Who\'s joining? Looking for 4 more players for a 5v5 match. Let\'s go! ⚽🔥', image: FIELDS[0]?.image, likes: 24, comments: 8, shares: 3, time: '15 min ago', sport: 'football', liked: false },
  { id: 'p2', author: PLAYERS[1], content: 'Won my first padel tournament today! Thanks to all the amazing players. What a community we have here! 🏆🎾', likes: 56, comments: 12, shares: 7, time: '1h ago', sport: 'padel', liked: true },
  { id: 'p3', author: PLAYERS[2], content: 'Training session at Kompleksi Sportiv Dinamo. The new basketball courts are amazing! Anyone up for a 3v3 this weekend?', image: FIELDS[1]?.image, likes: 31, comments: 5, shares: 2, time: '2h ago', sport: 'basketball', liked: false },
  { id: 'p4', author: PLAYERS[3], content: 'Beach volleyball season is here! 🏐🏖️ Looking for a partner for the Durrës Beach Tournament next month.', likes: 42, comments: 15, shares: 6, time: '3h ago', sport: 'volleyball', liked: false },
  { id: 'p5', author: PLAYERS[4], content: '400+ games played on Squad Buddy! This app has completely changed how I organize my sports life. Highly recommend to everyone!', likes: 89, comments: 22, shares: 14, time: '5h ago', liked: true },
];

const MOCK_GROUPS = [
  { id: 'g1', name: 'Tirana Football League', members: 342, emoji: '⚽', sport: 'football', image: FIELDS[0]?.image },
  { id: 'g2', name: 'Albanian Tennis Club', members: 128, emoji: '🎾', sport: 'tennis', image: FIELDS[5]?.image },
  { id: 'g3', name: 'Basketball Addicts', members: 256, emoji: '🏀', sport: 'basketball', image: FIELDS[1]?.image },
  { id: 'g4', name: 'Padel Lovers Albania', members: 189, emoji: '🏓', sport: 'padel', image: FIELDS[2]?.image },
  { id: 'g5', name: 'Beach Sports Durrës', members: 97, emoji: '🏐', sport: 'volleyball', image: FIELDS[4]?.image },
  { id: 'g6', name: 'Running & Fitness TI', members: 413, emoji: '🏃', sport: 'futsal', image: FIELDS[3]?.image },
];

const MOCK_EVENTS = [
  { id: 'e1', name: 'Friday Night Football', date: 'Feb 21', time: '20:00', location: 'Arena Kombetare', players: 18, maxPlayers: 22, sport: '⚽' },
  { id: 'e2', name: 'Tennis Doubles Tournament', date: 'Feb 23', time: '10:00', location: 'Tirana Tennis Club', players: 12, maxPlayers: 16, sport: '🎾' },
  { id: 'e3', name: '3v3 Basketball Showdown', date: 'Feb 24', time: '17:00', location: 'Kompleksi Dinamo', players: 9, maxPlayers: 12, sport: '🏀' },
  { id: 'e4', name: 'Beach Volleyball Meetup', date: 'Feb 28', time: '15:00', location: 'Durrës Beach', players: 8, maxPlayers: 16, sport: '🏐' },
  { id: 'e5', name: 'Padel Social Night', date: 'Mar 01', time: '19:00', location: 'Bregdeti Padel Club', players: 6, maxPlayers: 8, sport: '🏓' },
];

const LEADERBOARD = [...PLAYERS].sort((a, b) => b.gamesPlayed - a.gamesPlayed).slice(0, 15);

export default function CommunityScreen() {
  const [tab, setTab] = useState<Tab>('feed');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set(['g1']));
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());
  const [newPost, setNewPost] = useState('');

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };
  const toggleGroup = (id: string) => {
    setJoinedGroups(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleEvent = (id: string) => {
    setJoinedEvents(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const handlePost = () => {
    if (!newPost.trim()) return;
    const p = { id: `p${Date.now()}`, author: PLAYERS[0], content: newPost, likes: 0, comments: 0, shares: 0, time: 'Just now', liked: false };
    setPosts([p, ...posts]);
    setNewPost('');
  };

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'feed', label: 'Feed', icon: MessageCircle },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'leaderboard', label: 'Top Players', icon: Trophy },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={s.header}>
        <BackButton />
        <Text style={s.title}>Community</Text>
      </Animated.View>

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabBarScroll} contentContainerStyle={s.tabBar}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <AnimatedPressable key={t.id} style={[s.tabBtn, active && s.tabBtnActive]} onPress={() => setTab(t.id)}>
              <Icon size={13} color={active ? colors.primaryForeground : colors.mutedForeground} />
              <Text style={[s.tabText, active && s.tabTextActive]}>{t.label}</Text>
            </AnimatedPressable>
          );
        })}
      </ScrollView>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Feed */}
        {tab === 'feed' && (
          <>
            {/* Create post */}
            <View style={s.card}>
              <View style={s.createRow}>
                <Image source={{ uri: PLAYERS[0].avatar }} style={s.avatar} />
                <TextInput
                  style={s.createInput}
                  value={newPost}
                  onChangeText={setNewPost}
                  placeholder="Share something..."
                  placeholderTextColor={colors.mutedForeground}
                  multiline
                />
              </View>
              <AnimatedPressable style={[s.postBtn, !newPost.trim() && { opacity: 0.4 }]} onPress={handlePost} disabled={!newPost.trim()}>
                <Text style={s.postBtnText}>Post</Text>
              </AnimatedPressable>
            </View>

            {posts.map((post, idx) => {
              const sportObj = post.sport ? SPORTS.find(sp => sp.id === post.sport) : null;
              return (
                <Animated.View entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(500)} key={post.id} style={s.card}>
                  <View style={s.postHeader}>
                    <Image source={{ uri: post.author.avatar }} style={s.avatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.authorName}>{post.author.name}</Text>
                      <Text style={s.postMeta}>{post.author.location} · {post.time}</Text>
                    </View>
                    {sportObj && (
                      <View style={s.sportBadge}><Text style={s.sportBadgeText}>{sportObj.emoji} {sportObj.name}</Text></View>
                    )}
                  </View>
                  <Text style={s.postText}>{post.content}</Text>
                  {post.image && <Image source={{ uri: post.image }} style={s.postImage} />}
                  <View style={s.actions}>
                    <AnimatedPressable style={s.actionBtn} onPress={() => toggleLike(post.id)}>
                      <Heart size={16} color={post.liked ? colors.destructive : colors.mutedForeground} fill={post.liked ? colors.destructive : 'transparent'} />
                      <Text style={[s.actionText, post.liked && { color: colors.destructive }]}>{post.likes}</Text>
                    </AnimatedPressable>
                    <View style={s.actionBtn}>
                      <MessageCircle size={16} color={colors.mutedForeground} />
                      <Text style={s.actionText}>{post.comments}</Text>
                    </View>
                    <View style={s.actionBtn}>
                      <Share2 size={16} color={colors.mutedForeground} />
                      <Text style={s.actionText}>{post.shares}</Text>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </>
        )}

        {/* Groups */}
        {tab === 'groups' && (
          <>
            <Animated.View entering={FadeInDown.duration(400)} style={s.sectionHeader}>
              <Text style={s.sectionCount}>{MOCK_GROUPS.length} groups</Text>
              <AnimatedPressable style={s.createLink}>
                <Plus size={12} color={colors.primary} />
                <Text style={s.createLinkText}>Create Group</Text>
              </AnimatedPressable>
            </Animated.View>
            {MOCK_GROUPS.map((group, idx) => {
              const joined = joinedGroups.has(group.id);
              return (
                <Animated.View entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(500)} key={group.id} style={s.groupCard}>
                  {group.image && <Image source={{ uri: group.image }} style={s.groupImage} />}
                  <View style={{ flex: 1 }}>
                    <Text style={s.groupName} numberOfLines={1}>{group.name}</Text>
                    <Text style={s.groupMeta}>{group.emoji} · {group.members} members</Text>
                  </View>
                  <AnimatedPressable style={[s.joinBtn, joined && s.joinedBtn]} onPress={() => toggleGroup(group.id)}>
                    <Text style={[s.joinBtnText, joined && s.joinedBtnText]}>{joined ? 'Joined' : 'Join'}</Text>
                  </AnimatedPressable>
                </Animated.View>
              );
            })}
          </>
        )}

        {/* Events */}
        {tab === 'events' && (
          <>
            <Animated.View entering={FadeInDown.duration(400)} style={s.sectionHeader}>
              <Text style={s.sectionCount}>{MOCK_EVENTS.length} upcoming events</Text>
              <AnimatedPressable style={s.createLink}>
                <Plus size={12} color={colors.primary} />
                <Text style={s.createLinkText}>Create Event</Text>
              </AnimatedPressable>
            </Animated.View>
            {MOCK_EVENTS.map((event, idx) => {
              const joined = joinedEvents.has(event.id);
              const pct = (event.players / event.maxPlayers) * 100;
              return (
                <Animated.View entering={FadeInUp.delay(Math.min(idx, 6) * 80).duration(500)} key={event.id} style={s.card}>
                  <View style={s.eventHeader}>
                    <Text style={s.eventEmoji}>{event.sport}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.eventName}>{event.name}</Text>
                      <View style={s.eventMetaRow}>
                        <MapPin size={10} color={colors.mutedForeground} />
                        <Text style={s.eventMeta}>{event.location}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={s.eventInfoRow}>
                    <View style={s.eventInfoItem}><Calendar size={11} color={colors.mutedForeground} /><Text style={s.eventMeta}>{event.date}</Text></View>
                    <Text style={s.eventMeta}>{event.time}</Text>
                    <View style={s.eventInfoItem}><Users size={11} color={colors.mutedForeground} /><Text style={s.eventMeta}>{event.players}/{event.maxPlayers}</Text></View>
                  </View>
                  <View style={s.eventBottom}>
                    <View style={s.progressBg}><View style={[s.progressBar, { width: `${pct}%` }]} /></View>
                    <AnimatedPressable style={[s.joinBtn, joined && s.joinedBtn]} onPress={() => toggleEvent(event.id)}>
                      <Text style={[s.joinBtnText, joined && s.joinedBtnText]}>{joined ? 'Joined ✓' : 'Join'}</Text>
                    </AnimatedPressable>
                  </View>
                </Animated.View>
              );
            })}
          </>
        )}

        {/* Leaderboard */}
        {tab === 'leaderboard' && (
          <>
            {/* Top 3 Podium */}
            <View style={s.podiumRow}>
              {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((player, i) => {
                const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
                return (
                  <Animated.View entering={ZoomIn.delay(i * 100).duration(500)} key={player.id} style={s.podiumItem}>
                    <Text style={s.medal}>{medal}</Text>
                    <Image source={{ uri: player.avatar }} style={[s.podiumAvatar, rank === 1 && s.podiumAvatarGold]} />
                    <Text style={s.podiumName} numberOfLines={1}>{player.name.split(' ')[0]}</Text>
                    <Text style={s.podiumGames}>{player.gamesPlayed} games</Text>
                    <View style={[s.podiumBar, { height: rank === 1 ? 80 : rank === 2 ? 64 : 48 }]} />
                  </Animated.View>
                );
              })}
            </View>

            {LEADERBOARD.slice(3).map((player, i) => (
              <Animated.View entering={FadeInUp.delay(Math.min(i, 6) * 80).duration(500)} key={player.id} style={s.leaderRow}>
                <Text style={s.leaderRank}>{i + 4}</Text>
                <Image source={{ uri: player.avatar }} style={s.leaderAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={s.leaderName} numberOfLines={1}>{player.name}</Text>
                  <Text style={s.leaderLoc}>{player.location}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.leaderGames}>{player.gamesPlayed}</Text>
                  <Text style={s.leaderLabel}>games</Text>
                </View>
              </Animated.View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: colors.foreground, marginTop: 10 },
  tabBarScroll: { flexGrow: 0 },
  tabBar: { paddingHorizontal: 16, gap: 6, paddingBottom: 12 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.muted + '80' },
  tabBtnActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: colors.mutedForeground },
  tabTextActive: { color: colors.primaryForeground },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, gap: 12 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.border },
  createRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.muted },
  createInput: { flex: 1, fontSize: 13, color: colors.foreground, minHeight: 40, textAlignVertical: 'top' },
  postBtn: { alignSelf: 'flex-end', backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  postBtnText: { color: colors.primaryForeground, fontSize: 12, fontWeight: '700' },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  authorName: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  postMeta: { fontSize: 10, color: colors.mutedForeground, marginTop: 1 },
  sportBadge: { backgroundColor: colors.muted, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  sportBadgeText: { fontSize: 10, color: colors.foreground },
  postText: { fontSize: 13, color: colors.foreground, lineHeight: 20, marginBottom: 10 },
  postImage: { width: '100%', height: 160, borderRadius: 12, marginBottom: 10, backgroundColor: colors.muted },
  actions: { flexDirection: 'row', gap: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 12, color: colors.mutedForeground },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  sectionCount: { fontSize: 11, color: colors.mutedForeground },
  createLink: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  createLinkText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  groupCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.border },
  groupImage: { width: 52, height: 52, borderRadius: 12, backgroundColor: colors.muted },
  groupName: { fontSize: 13, fontWeight: '700', color: colors.foreground },
  groupMeta: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  joinBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, backgroundColor: colors.primary },
  joinedBtn: { backgroundColor: colors.muted },
  joinBtnText: { fontSize: 11, fontWeight: '700', color: colors.primaryForeground },
  joinedBtnText: { color: colors.mutedForeground },
  eventHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  eventEmoji: { fontSize: 28 },
  eventName: { fontSize: 14, fontWeight: '700', color: colors.foreground },
  eventMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  eventMeta: { fontSize: 11, color: colors.mutedForeground },
  eventInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  eventInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  eventBottom: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBg: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.muted, overflow: 'hidden' },
  progressBar: { height: 5, borderRadius: 3, backgroundColor: colors.primary },
  podiumRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingTop: 16, paddingBottom: 8, gap: 12 },
  podiumItem: { alignItems: 'center', width: 80 },
  medal: { fontSize: 20, marginBottom: 4 },
  podiumAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.muted },
  podiumAvatarGold: { width: 52, height: 52, borderRadius: 26, borderColor: colors.accent },
  podiumName: { fontSize: 11, fontWeight: '700', color: colors.foreground, marginTop: 4 },
  podiumGames: { fontSize: 9, fontWeight: '700', color: colors.primary },
  podiumBar: { width: 56, borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: colors.primary + '1A', borderTopWidth: 2, borderTopColor: colors.primary + '66', marginTop: 6 },
  leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border },
  leaderRank: { width: 22, textAlign: 'center', fontSize: 12, fontWeight: '800', color: colors.mutedForeground },
  leaderAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.muted },
  leaderName: { fontSize: 13, fontWeight: '600', color: colors.foreground },
  leaderLoc: { fontSize: 10, color: colors.mutedForeground },
  leaderGames: { fontSize: 12, fontWeight: '800', color: colors.primary },
  leaderLabel: { fontSize: 9, color: colors.mutedForeground },
});
