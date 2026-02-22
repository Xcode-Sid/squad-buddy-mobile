import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpCircle, ArrowDownCircle, RotateCcw, Star, Gift } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import BackButton from '../components/BackButton';
import AnimatedPressable from '../components/AnimatedPressable';
import { formatPrice } from '../utils/formatting';
import { MOCK_WALLET } from '../data/walletData';
import type { WalletTransaction } from '../data/walletData';

const TX_ICONS: Record<WalletTransaction['type'], { icon: typeof ArrowUpCircle; color: string }> = {
  topup: { icon: ArrowUpCircle, color: colors.green500 },
  payment: { icon: ArrowDownCircle, color: colors.destructive },
  refund: { icon: RotateCcw, color: colors.blue500 },
  reward: { icon: Star, color: colors.accent },
  gift: { icon: Gift, color: colors.pink500 },
};

function TxIcon({ type }: { type: WalletTransaction['type'] }) {
  const { icon: Icon, color } = TX_ICONS[type];
  return <Icon size={20} color={color} />;
}

export default function WalletScreen() {
  const nav = useNavigation();
  const { balance, currency, transactions, giftCards } = MOCK_WALLET;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Wallet</Text>
        <Text style={styles.subtitle}>Balance & transactions</Text>
      </Animated.View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={ZoomIn.duration(500).delay(100)} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{balance.toLocaleString()} {currency}</Text>
          <View style={styles.balanceActions}>
            <AnimatedPressable style={styles.balanceBtn}>
              <ArrowUpCircle size={20} color={colors.primaryForeground} />
              <Text style={styles.balanceBtnText}>Top Up</Text>
            </AnimatedPressable>
            <AnimatedPressable style={[styles.balanceBtn, styles.balanceBtnOutline]}>
              <ArrowDownCircle size={20} color={colors.foreground} />
              <Text style={styles.balanceBtnTextOutline}>Withdraw</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400).delay(200)}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </Animated.View>
        <View style={styles.txList}>
          {transactions.slice(0, 10).map((tx, index) => (
            <Animated.View key={tx.id} entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 80)} style={styles.txRow}>
              <View style={styles.txIconWrap}>
                <TxIcon type={tx.type} />
              </View>
              <View style={styles.txContent}>
                <Text style={styles.txDesc}>{tx.description}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  tx.amount > 0 ? styles.txAmountPos : styles.txAmountNeg,
                ]}
              >
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {currency}
              </Text>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.duration(400)}>
          <Text style={styles.sectionTitle}>Gift Cards</Text>
        </Animated.View>
        <View style={styles.giftList}>
          {giftCards.map((gc, index) => (
            <Animated.View key={gc.id} entering={FadeInUp.duration(400).delay(Math.min(index, 6) * 80)} style={styles.giftCard}>
              <Gift size={24} color={colors.pink500} />
              <View style={styles.giftContent}>
                <Text style={styles.giftCode}>{gc.code}</Text>
                <Text style={styles.giftAmount}>
                  {gc.remainingAmount.toLocaleString()} / {gc.amount.toLocaleString()} {currency}
                </Text>
                {gc.fromPlayer && (
                  <Text style={styles.giftFrom}>From {gc.fromPlayer}</Text>
                )}
                <Text style={styles.giftExp}>Expires {gc.expiresAt}</Text>
              </View>
              <View style={[styles.giftBadge, gc.isRedeemed && styles.giftBadgeUsed]}>
                <Text style={styles.giftBadgeText}>{gc.isRedeemed ? 'Used' : 'Active'}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
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
    marginTop: 12,
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
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 16,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  balanceBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  balanceBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceBtnTextOutline: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
  },
  txList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 24,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  txIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txContent: {
    flex: 1,
  },
  txDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  txDate: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  txAmountPos: {
    color: colors.green500,
  },
  txAmountNeg: {
    color: colors.destructive,
  },
  giftList: {
    gap: 10,
  },
  giftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  giftContent: {
    flex: 1,
    marginLeft: 12,
  },
  giftCode: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
  },
  giftAmount: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  giftFrom: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  giftExp: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  giftBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary + '2A',
  },
  giftBadgeUsed: {
    backgroundColor: colors.muted,
  },
  giftBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
