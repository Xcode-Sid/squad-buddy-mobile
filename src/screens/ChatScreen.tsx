import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { CHAT_ROOMS, CHAT_MESSAGES } from '../data/chatData';
import type { ChatRoom } from '../data/chatData';

export default function ChatScreen() {
  const nav = useNavigation();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [inputText, setInputText] = useState('');

  const messages = selectedRoom ? (CHAT_MESSAGES[selectedRoom.id] ?? []) : [];

  const sendMessage = () => {
    if (!inputText.trim() || !selectedRoom) return;
    setInputText('');
  };

  if (selectedRoom) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedRoom(null)}>
            <BackButton />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Image source={{ uri: selectedRoom.avatar || 'https://i.pravatar.cc/150?img=12' }} style={styles.chatAvatar} />
            <View>
              <Text style={styles.chatHeaderTitle}>{selectedRoom.name}</Text>
              {selectedRoom.online !== undefined && (
                <Text style={styles.chatHeaderSub}>{selectedRoom.online} online</Text>
              )}
            </View>
          </View>
        </Animated.View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.isMe ? styles.messageBubbleMe : styles.messageBubbleThem,
                ]}
              >
                {!item.isMe && (
                  <Image source={{ uri: item.senderAvatar }} style={styles.msgAvatar} />
                )}
                <View style={[styles.messageContent, item.isMe ? styles.messageContentMe : styles.messageContentThem]}>
                  {!item.isMe && (
                    <Text style={styles.msgSender}>{item.senderName}</Text>
                  )}
                  <Text style={styles.msgText}>{item.text}</Text>
                  <Text style={styles.msgTime}>{item.timestamp}</Text>
                </View>
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.mutedForeground}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <AnimatedPressable
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Send size={20} color={inputText.trim() ? colors.primary : colors.mutedForeground} />
            </AnimatedPressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Chat with your squad</Text>
      </Animated.View>

      <FlatList
        data={CHAT_ROOMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.roomList}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(Math.min(index, 6) * 80).duration(500)}>
            <AnimatedPressable
              style={styles.roomCard}
              onPress={() => setSelectedRoom(item)}
            >
              <Image
                source={{ uri: item.avatar || 'https://i.pravatar.cc/150?img=12' }}
                style={styles.roomAvatar}
              />
              <View style={styles.roomContent}>
                <View style={styles.roomRow}>
                  <Text style={styles.roomName}>{item.name}</Text>
                  <Text style={styles.roomTime}>{item.lastMessageTime}</Text>
                </View>
                <Text style={styles.roomLast} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </AnimatedPressable>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
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
  roomList: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roomAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  roomContent: {
    flex: 1,
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  roomTime: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  roomLast: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
  },
  chatHeaderSub: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageBubbleMe: {
    justifyContent: 'flex-end',
  },
  messageBubbleThem: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  messageContentMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageContentThem: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  msgSender: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  msgText: {
    fontSize: 15,
    color: colors.foreground,
  },
  msgTime: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 24,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.muted,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 16,
    fontSize: 15,
    color: colors.foreground,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendBtnDisabled: {
    backgroundColor: colors.muted,
  },
});
