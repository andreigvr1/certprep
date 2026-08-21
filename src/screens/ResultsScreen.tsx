import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { AppText, Button, Card, Pill, ProgressBar, Row, Screen, SectionHeader } from '../components/ui';
import { getTopic } from '../content/repository';
import type { RootNav } from '../navigation/types';
import { useQuiz } from '../store/quizStore';
import { useTheme } from '../theme/theme';

export default function ResultsScreen() {
  const nav = useNavigation<RootNav>();
  const { colors, spacing } = useTheme();
  const result = useQuiz((s) => s.result);

  if (!result) {
    return (
      <Screen scroll={false}>
        <Card>
          <AppText variant="h3">No results to show</AppText>
          <Button title="Back to home" onPress={() => nav.navigate('Tabs')} style={{ marginTop: spacing.lg }} />
        </Card>
      </Screen>
    );
  }

  const pct = result.total ? result.correct / result.total : 0;
  const passed = pct >= 0.72;
  const color = passed ? colors.success : pct >= 0.5 ? colors.warn : colors.danger;

  // topics that had at least one miss, with miss counts
  const missByTopic = new Map<string, number>();
  for (const p of result.perQuestion) {
    if (!p.correct) missByTopic.set(p.topicId, (missByTopic.get(p.topicId) ?? 0) + 1);
  }
  const weakTopics = [...missByTopic.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <Screen>
      <AppText variant="label">{result.scopeLabel}</AppText>
      <AppText variant="title">Results</AppText>

      <Card style={{ marginTop: spacing.lg, alignItems: 'center' }}>
        <AppText variant="display" color={color}>
          {Math.round(pct * 100)}%
        </AppText>
        <AppText variant="h3" color={colors.textMuted}>
          {result.correct} of {result.total} correct
        </AppText>
        <View style={{ width: '100%', marginTop: spacing.md }}>
          <ProgressBar value={pct} color={color} height={10} />
        </View>
        <AppText variant="muted" center style={{ marginTop: spacing.md }}>
          {passed
            ? 'Above the 72% pass line for this set. Keep the streak going.'
            : 'Below the pass line for this set — the misses below are your best next study target.'}
        </AppText>
      </Card>

      {weakTopics.length ? (
        <>
          <SectionHeader title="Study these next" />
          {weakTopics.map(([topicId, misses]) => {
            const t = getTopic(topicId);
            if (!t) return null;
            return (
              <Card key={topicId} style={{ marginBottom: spacing.sm }} onPress={() => nav.navigate('TopicDetail', { topicId })}>
                <Row justify="space-between">
                  <AppText variant="h3" style={{ flex: 1, paddingRight: spacing.sm }} numberOfLines={2}>
                    {t.name}
                  </AppText>
                  <Pill label={`${misses} missed`} bg={colors.dangerBg} color={colors.danger} />
                </Row>
                <AppText variant="muted" style={{ marginTop: spacing.xs }}>
                  Tap to read the “learn this” note →
                </AppText>
              </Card>
            );
          })}
        </>
      ) : (
        <Card style={{ marginTop: spacing.lg, backgroundColor: colors.successBg, borderColor: colors.successBg }}>
          <AppText variant="h3" color={colors.success}>
            Clean sweep — every question correct.
          </AppText>
        </Card>
      )}

      <Row gap={10} style={{ marginTop: spacing.xl }}>
        <Button title="Review weak spots" onPress={() => nav.replace('Quiz', { scope: { kind: 'weak' }, title: 'Weak-spot review' })} style={{ flex: 1 }} />
        <Button title="Home" variant="secondary" onPress={() => nav.navigate('Tabs')} style={{ flex: 1 }} />
      </Row>
    </Screen>
  );
}
