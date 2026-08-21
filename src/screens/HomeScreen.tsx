import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { AppText, Button, Card, Pill, ProgressBar, Row, Screen, SectionHeader } from '../components/ui';
import { domainColor, exam, pack } from '../content/repository';
import { domainMastery, readiness } from '../logic/mastery';
import type { RootNav } from '../navigation/types';
import { useProgress } from '../store/progressStore';
import { useTheme } from '../theme/theme';

export default function HomeScreen() {
  const nav = useNavigation<RootNav>();
  const { colors, spacing } = useTheme();
  const qstats = useProgress((s) => s.qstats);

  const r = readiness(qstats);
  const dm = domainMastery(qstats);
  const scoreColor = !r.enoughData ? colors.textMuted : r.ready ? colors.success : colors.warn;

  return (
    <Screen>
      <AppText variant="label">CertPrep</AppText>
      <AppText variant="title">{pack.name}</AppText>
      <Row gap={8} style={{ marginTop: spacing.sm }}>
        <Pill label={pack.code} bg={colors.primarySoft} color={colors.primary} />
        <Pill label={`${exam.numQuestions} Q · ${exam.minutes} min`} />
        <Pill label={`Pass ${exam.passScore}`} />
      </Row>

      {/* Readiness */}
      <Card style={{ marginTop: spacing.lg }}>
        <AppText variant="label">Readiness estimate</AppText>
        <Row align="flex-end" gap={6} style={{ marginTop: spacing.sm }}>
          <AppText variant="display" color={scoreColor}>
            {r.enoughData ? r.scaled : '—'}
          </AppText>
          <AppText variant="h3" color={colors.textMuted} style={{ marginBottom: 6 }}>
            / {exam.scoreMax}
          </AppText>
        </Row>
        <View style={{ marginTop: spacing.sm }}>
          <ProgressBar value={r.accuracy} color={scoreColor} height={10} />
        </View>
        <AppText variant="muted" style={{ marginTop: spacing.sm }}>
          {r.label}
        </AppText>
        <AppText variant="muted" style={{ marginTop: 2 }}>
          {r.answered} of {r.totalQuestions} questions practised
        </AppText>
        <Row gap={10} style={{ marginTop: spacing.lg }}>
          <Button
            title="Review weak spots"
            onPress={() => nav.navigate('Quiz', { scope: { kind: 'weak' }, title: 'Weak-spot review' })}
            style={{ flex: 1 }}
          />
          <Button
            title="Quick 10"
            variant="secondary"
            onPress={() => nav.navigate('Quiz', { scope: { kind: 'all' }, title: 'Quick practice' })}
            style={{ flex: 1 }}
          />
        </Row>
      </Card>

      {/* Domains */}
      <SectionHeader title="By domain" action={{ label: 'Practice all', onPress: () => nav.navigate('Tabs') }} />
      {dm.map((d) => (
        <Card
          key={d.domainId}
          style={{ marginBottom: spacing.sm }}
          onPress={() => nav.navigate('Quiz', { scope: { kind: 'domain', id: d.domainId }, title: d.name })}
        >
          <Row justify="space-between">
            <AppText variant="h3" style={{ flex: 1, paddingRight: spacing.sm }} numberOfLines={2}>
              {d.name}
            </AppText>
            <Pill label={`${d.weight}%`} bg={colors.cardAlt} />
          </Row>
          <Row gap={10} style={{ marginTop: spacing.md }}>
            <View style={{ flex: 1 }}>
              <ProgressBar value={d.accuracy} color={domainColor(d.domainId)} />
            </View>
            <AppText variant="mono" color={colors.textMuted}>
              {d.attempts ? `${Math.round(d.accuracy * 100)}%` : 'new'}
            </AppText>
          </Row>
        </Card>
      ))}

      {/* Method */}
      <Card style={{ marginTop: spacing.lg, backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
        <AppText variant="h3" color={colors.primary}>
          How to use this
        </AppText>
        <AppText variant="muted" style={{ marginTop: spacing.xs }}>
          Answer first, read the explanation second — active recall beats re-reading. The app keeps
          resurfacing what you get wrong and points you to the exact “learn this” note. Use{' '}
          <AppText color={colors.primary}>Learn ▸ Confusables</AppText> to tell apart look-alike services.
        </AppText>
      </Card>
    </Screen>
  );
}
