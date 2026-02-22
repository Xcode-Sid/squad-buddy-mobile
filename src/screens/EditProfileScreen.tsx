import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInUp, ZoomIn, FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Camera, Check, MapPin } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { SPORTS } from '../data/mockData';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face',
];

const CITIES = ['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Korçë', 'Fier', 'Berat'];

export default function EditProfileScreen() {
  const nav = useNavigation<any>();
  const { user, updateProfile } = useAuth();

  const isIndividual = user?.role === 'individual';
  const profile = isIndividual ? user : null;

  const [name, setName] = useState(user?.name ?? '');
  const [username, setUsername] = useState(
    profile && 'username' in profile ? profile.username : '',
  );
  const [bio, setBio] = useState(
    profile && 'bio' in profile ? profile.bio : '',
  );
  const [location, setLocation] = useState(
    profile && 'location' in profile ? profile.location : '',
  );
  const [favoriteSport, setFavoriteSport] = useState(
    profile && 'favoriteSport' in profile ? profile.favoriteSport : '',
  );
  const [selectedSports, setSelectedSports] = useState<string[]>(
    profile && 'sports' in profile ? [...profile.sports] : [],
  );
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleSport = (sportId: string) => {
    setSelectedSports(prev =>
      prev.includes(sportId)
        ? prev.filter(s => s !== sportId)
        : [...prev, sportId],
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Name cannot be empty');
      return;
    }
    if (!username.trim()) {
      Alert.alert('Required', 'Username cannot be empty');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        avatar,
        ...(isIndividual
          ? {
              username: username.trim(),
              bio: bio.trim(),
              location,
              favoriteSport: favoriteSport || selectedSports[0] || 'football',
              sports: selectedSports,
            }
          : {}),
      });
      setSaving(false);
      Alert.alert('Saved', 'Your profile has been updated!', [
        { text: 'OK', onPress: () => nav.goBack() },
      ]);
    }, 600);
  };

  return (
    <SafeAreaView style={st.safe} edges={['top']}>
      <View style={st.header}>
        <BackButton />
        <Text style={st.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={[st.saveBtn, saving && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Check size={18} color={colors.primaryForeground} />
          <Text style={st.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={st.scroll}
          contentContainerStyle={st.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <Animated.View entering={ZoomIn.duration(400)} style={st.avatarSection}>
            <AnimatedPressable
              style={st.avatarWrap}
              onPress={() => setShowAvatarPicker(!showAvatarPicker)}
            >
              <Image source={{ uri: avatar }} style={st.avatar} />
              <View style={st.cameraBadge}>
                <Camera size={14} color={colors.primaryForeground} />
              </View>
            </AnimatedPressable>
            <Text style={st.avatarHint}>Tap to change photo</Text>
          </Animated.View>

          {showAvatarPicker && (
            <View style={st.avatarPicker}>
              {AVATAR_OPTIONS.map(url => (
                <TouchableOpacity
                  key={url}
                  onPress={() => {
                    setAvatar(url);
                    setShowAvatarPicker(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: url }}
                    style={[
                      st.avatarOption,
                      avatar === url && st.avatarOptionSelected,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Form Fields */}
          <Animated.View entering={FadeInUp.delay(100).duration(400)} style={st.fieldGroup}>
            <Text style={st.label}>Full Name</Text>
            <TextInput
              style={st.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.mutedForeground}
            />
          </Animated.View>

          {isIndividual && (
            <>
              <Animated.View entering={FadeInUp.delay(200).duration(400)} style={st.fieldGroup}>
                <Text style={st.label}>Username</Text>
                <TextInput
                  style={st.input}
                  value={username}
                  onChangeText={t => setUsername(t.replace(/\s/g, '').toLowerCase())}
                  placeholder="@username"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="none"
                />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(300).duration(400)} style={st.fieldGroup}>
                <Text style={st.label}>Bio</Text>
                <TextInput
                  style={[st.input, st.inputMultiline]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell others about yourself..."
                  placeholderTextColor={colors.mutedForeground}
                  multiline
                  maxLength={150}
                  textAlignVertical="top"
                />
                <Text style={st.charCount}>{bio.length}/150</Text>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(400).duration(400)} style={st.fieldGroup}>
                <Text style={st.label}>Location</Text>
                <View style={st.chipRow}>
                  {CITIES.map(city => (
                    <TouchableOpacity
                      key={city}
                      style={[st.chip, location === city && st.chipActive]}
                      onPress={() => setLocation(city)}
                      activeOpacity={0.8}
                    >
                      <MapPin
                        size={12}
                        color={location === city ? colors.primaryForeground : colors.mutedForeground}
                      />
                      <Text
                        style={[
                          st.chipText,
                          location === city && st.chipTextActive,
                        ]}
                      >
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(500).duration(400)} style={st.fieldGroup}>
                <Text style={st.label}>Sports</Text>
                <Text style={st.sublabel}>Select sports you play</Text>
                <View style={st.chipRow}>
                  {SPORTS.map(sport => {
                    const active = selectedSports.includes(sport.id);
                    return (
                      <TouchableOpacity
                        key={sport.id}
                        style={[st.sportChip, active && st.sportChipActive]}
                        onPress={() => toggleSport(sport.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={st.sportEmoji}>{sport.emoji}</Text>
                        <Text
                          style={[
                            st.sportChipText,
                            active && st.sportChipTextActive,
                          ]}
                        >
                          {sport.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(600).duration(400)} style={st.fieldGroup}>
                <Text style={st.label}>Favorite Sport</Text>
                <View style={st.chipRow}>
                  {selectedSports.length > 0
                    ? selectedSports.map(sid => {
                        const sport = SPORTS.find(s => s.id === sid);
                        if (!sport) return null;
                        const isFav = favoriteSport === sid;
                        return (
                          <TouchableOpacity
                            key={sid}
                            style={[st.chip, isFav && st.chipActive]}
                            onPress={() => setFavoriteSport(sid)}
                            activeOpacity={0.8}
                          >
                            <Text style={st.sportEmoji}>{sport.emoji}</Text>
                            <Text
                              style={[
                                st.chipText,
                                isFav && st.chipTextActive,
                              ]}
                            >
                              {sport.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    : (
                      <Text style={st.sublabel}>Select sports above first</Text>
                    )}
                </View>
              </Animated.View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginLeft: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: colors.primaryForeground },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.muted,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarHint: { fontSize: 12, color: colors.mutedForeground, marginTop: 8 },
  avatarPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.muted,
  },
  avatarOptionSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  fieldGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.foreground,
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 11,
    color: colors.mutedForeground,
    textAlign: 'right',
    marginTop: 4,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { fontSize: 13, color: colors.foreground },
  chipTextActive: { color: colors.primaryForeground, fontWeight: '600' },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sportChipActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  sportEmoji: { fontSize: 16 },
  sportChipText: { fontSize: 13, color: colors.foreground },
  sportChipTextActive: { color: colors.primary, fontWeight: '600' },
});
