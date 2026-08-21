import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { AppText, Button, Card, Pill, ProgressBar, Row, Screen, SectionHeader } from '../components/ui';
import { domainColor, domains, questionsForDomain, topicsForDomain } from '../content/repository';
import { domainMastery } from '../logic/mastery';
import type { RootNav } from '../navigation/types';
import { useProgress } from '../store/progressStore';
import { useTheme } from '../theme/theme';

export default function PracticeScreen() {
  const nav = useNavigation<RootNav>();
  const { colors, spacing } = useTheme();
  const qstats = useProgress((s) => s.qstats);
  const dm = domainMastery(qstats);
  const byId = Object.fromEntries(dm.map((d) => [d.domainId, d]));

  return (
    <Screen>
      <AppText variant="label">Practice</AppText>
      <AppText variant="title">Build a quiz</AppText>

      <Card style={{ marginTop: spacing.lg }}>
        <AppText variant="h3">Mixed practice</AppText>
        <AppText variant="muted" style={{ marginTop: spacing.xs }}>
          Questions are weighted toward what you haven’t seen or got wrong.
        </AppText>
        <Row gap={10} style={{ marginTop: spacing.lg }}>
          <Button title="Practice 20" onPress={() => nav.navigate('Quiz', { scope: { kind: 'all' }, title: 'Practice set', count: 20 })} style={{ flex: 1 }} />
          <Button
            title="Quick 10"
            variant="secondary"
            onPress={() => nav.navigate('Quiz', { scope: { kind: 'all' }, title: 'Quick practice', count: 10 })}
            style={{ flex: 1 }}
          />
        </Row>
        <Button
          title="Review my weak spots"
          variant="ghost"
          onPress={() => nav.navigate('Quiz', { scope: { kind: 'weak' }, title: 'Weak-spot review' })}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      <SectionHeader title="By domain" />
      {domains.map((d) => {
        const m = byId[d.id];
        return (
          <Card
            key={d.id}
            style={{ marginBottom: spacing.sm }}
            onPress={() => nav.navigate('Quiz', { scope: { kind: 'domain', id: d.id }, title: d.name })}
          >
            <Row justify="space-between">
              <AppText variant="h3" style={{ flex: 1, paddingRight: spacing.sm }} numberOfLines={2}>
                {d.name}
              </AppText>
              <Pill label={`${d.weight}%`} bg={colors.primarySoft} color={colors.primary} />
            </Row>
            <AppText variant="muted" style={{ marginTop: spacing.xs }}>
              {questionsForDomain(d.id).length} questions · {topicsForDomain(d.id).length} topics
            </AppText>
            <Row gap={10} style={{ marginTop: spacing.md }}>
              <View style={{ flex: 1 }}>
                <ProgressBar value={m?.accuracy ?? 0} color={domainColor(d.id)} />
              </View>
              <AppText variant="mono" color={colors.textMuted}>
                {m && m.attempts ? `${Math.round(m.accuracy * 100)}%` : 'new'}
              </AppText>
            </Row>
          </Card>
        );
      })}
    </Screen>
  );
}
