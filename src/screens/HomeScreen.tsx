import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius, shadow } from '../theme';

interface MenuCardProps {
  icon: string;
  title: string;
  subtitle: string;
  badge?: string;
  color: string;
  onPress: () => void;
}

function MenuCard({ icon, title, subtitle, badge, color, onPress }: MenuCardProps) {
  return (
    <TouchableOpacity style={[styles.menuCard, { borderColor: color + '44' }]} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSub}>{subtitle}</Text>
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[styles.badgeText, { color }]}>{badge}</Text>
        </View>
      )}
      <Text style={[styles.arrow, { color }]}>›</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: any) {
  const { userName, logout } = useAuth();

  async function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  const firstName = userName?.split(' ')[0] ?? 'Consultor';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.topBar}>
          <View>
            <Text style={styles.greet}>Olá, {firstName} </Text>
            <Text style={styles.role}>Consultor Ford</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroAccent} />
          <Text style={styles.heroLabel}>SISTEMA ATIVO</Text>
          <Text style={styles.heroTitle}>Ford Radar</Text>
          <Text style={styles.heroSub}>
            Inteligência competitiva e retenção de clientes em tempo real.
          </Text>
        </View>

        {/* Quick stats
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>IA</Text>
            <Text style={styles.statLabel}>Gemini powered</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMid]}>
            <Text style={[styles.statValue, { color: colors.success }]}>JWT</Text>
            <Text style={styles.statLabel}>Sessão segura</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.warning }]}>Live</Text>
            <Text style={styles.statLabel}>Dados em tempo real</Text>
          </View>
        </View> */}

        <Text style={styles.sectionLabel}>MÓDULOS</Text>

        <MenuCard
          icon="⚡"
          title="Radar da Concorrência"
          subtitle="Compare specs de qualquer veículo com a IA"
          badge="IA"
          color={colors.accent}
          onPress={() => navigation.navigate('Compare')}
        />

        {/* <MenuCard
          icon="📊"
          title="Retenção de Clientes"
          subtitle="Scores preditivos de fidelização"
          color={colors.success}
          onPress={() => navigation.navigate('Predictions')}
        /> */}

        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Use o Radar antes de cada apresentação para ter argumentos técnicos precisos.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greet: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  role: { fontSize: 12, color: colors.textSecondary, marginTop: 2, letterSpacing: 0.5 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  logoutText: { color: colors.textSecondary, fontSize: 13 },

  hero: {
    backgroundColor: colors.fordBlueDark,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.fordBlue,
    overflow: 'hidden',
    position: 'relative',
  },
  heroAccent: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent + '10',
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 4,
  },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 20 },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBoxMid: {
    borderColor: colors.success + '44',
    backgroundColor: colors.successBg,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: 1,
  },
  statLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },

  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    gap: spacing.md,
    ...shadow.card,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22 },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  menuSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  arrow: { fontSize: 22, fontWeight: '300' },

  hint: {
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning + '44',
  },
  hintText: { color: colors.warning, fontSize: 13, lineHeight: 19 },
});
