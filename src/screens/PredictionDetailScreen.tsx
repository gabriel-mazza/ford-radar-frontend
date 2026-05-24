import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { BackHeader, Card, ScoreBadge, SectionHeader } from '../components/UI';
import { PredictionResponse } from '../services/api';
import { colors, spacing, radius } from '../theme';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  value: { fontSize: 13, color: colors.textPrimary, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
});

function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 70 ? colors.scoreHigh : score >= 40 ? colors.scoreMid : colors.scoreLow;
  const filled = Math.round(score / 10);

  return (
    <View style={gaugeStyles.wrapper}>
      <Text style={[gaugeStyles.value, { color }]}>{score.toFixed(1)}</Text>
      <Text style={gaugeStyles.max}>/100</Text>
      <View style={gaugeStyles.bar}>
        {Array.from({ length: 10 }).map((_, i) => (
          <View
            key={i}
            style={[
              gaugeStyles.segment,
              i < filled
                ? { backgroundColor: color, opacity: 1 - i * 0.03 }
                : { backgroundColor: colors.border },
            ]}
          />
        ))}
      </View>
      <Text style={[gaugeStyles.riskLabel, { color }]}>
        {score >= 70 ? '✅ Alta probabilidade de retenção' : score >= 40 ? '⚠️ Atenção necessária' : '🚨 Risco de abandono'}
      </Text>
    </View>
  );
}

const gaugeStyles = StyleSheet.create({
  wrapper: { alignItems: 'center', paddingVertical: spacing.md },
  value: { fontSize: 56, fontWeight: '900', lineHeight: 64 },
  max: { fontSize: 16, color: colors.textMuted, marginTop: -8 },
  bar: { flexDirection: 'row', gap: 4, marginTop: spacing.md, marginBottom: spacing.sm },
  segment: { width: 24, height: 8, borderRadius: 4 },
  riskLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
});

export default function PredictionDetailScreen({ route, navigation }: any) {
  const { prediction } = route.params as { prediction: PredictionResponse };
  const score = Number(prediction.retentionScore);
  const date = new Date(prediction.predictionDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const actions =
    score >= 70
      ? [
          'Agendar revisão preventiva e reforçar fidelidade',
          'Oferecer upgrade de plano de revisões',
          'Convidar para test-drive do novo modelo',
        ]
      : score >= 40
      ? [
          'Ligar em até 48h para entender insatisfações',
          'Verificar histórico de revisões em atraso',
          'Apresentar condições especiais de renovação',
        ]
      : [
          'Contato imediato — risco crítico de abandono',
          'Escalona para gerente de relacionamento',
          'Proposta de retenção com benefícios exclusivos',
        ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <BackHeader title="Detalhes do Cliente" onBack={() => navigation.goBack()} />

        <Card style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>SCORE DE RETENÇÃO</Text>
          <ScoreGauge score={score} />
        </Card>

        <Card style={styles.card}>
          <SectionHeader title="Dados do Cliente" />
          <InfoRow label="Nome" value={prediction.customerName || '—'} />
          <InfoRow label="E-mail" value={prediction.customerEmail || '—'} />
          <InfoRow label="Telefone" value={prediction.phone || '—'} />
          <InfoRow label="VIN do Veículo" value={prediction.vin} />
          <InfoRow label="Data da Predição" value={date} />
          <InfoRow label="ID do Registro" value={`#${prediction.id}`} />
        </Card>

        <Card style={styles.card}>
          <SectionHeader
            title="Plano de Ação Recomendado"
            subtitle="Com base no score preditivo do modelo ML"
          />
          {actions.map((action, i) => (
            <View key={i} style={styles.actionItem}>
              <Text style={styles.actionNumber}>{i + 1}</Text>
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.radarSection}>
          <SectionHeader
            title="Radar de Pós-Venda Ford"
            subtitle="Argumentos de retenção disponíveis"
          />
          <View style={styles.radarGrid}>
            {[
              { icon: '🔧', label: 'Revisões Programadas' },
              { icon: '🛡️', label: 'Garantia Estendida' },
              { icon: '📱', label: 'FordPass App' },
              { icon: '📦', label: 'Peças Originais' },
            ].map((item) => (
              <View key={item.label} style={styles.radarItem}>
                <Text style={styles.radarIcon}>{item.icon}</Text>
                <Text style={styles.radarLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  scoreCard: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },

  card: { marginBottom: spacing.md },

  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentGlow,
    borderWidth: 1,
    borderColor: colors.accent,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  actionText: { flex: 1, fontSize: 13, color: colors.textPrimary, lineHeight: 20 },

  radarSection: { marginTop: spacing.sm },
  radarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  radarItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radarIcon: { fontSize: 24 },
  radarLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
});
