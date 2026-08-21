import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, View } from 'react-native';
import { AppText, Button, Card, Divider, Pill, ProgressBar, Row, Screen, SectionHeader } from '../components/ui';
import { domainColor, domains, questions, topicsForDomain } from '../content/repository';
import { topicMastery, TopicStatus } from '../logic/mastery';
import type { RootNav } from '../navigation/types';
import { useProgress } from '../store/progressStore';
import { useTheme } from '../theme/theme';

function useStatusMeta() {
  const { colors } = useTheme();
  const map: Record<TopicStatus, { label: string; color: string; bg: string }> = {
    new: { label: 'New', color: colors.textMuted, bg: colors.cardAlt },
    learning: { label: 'Learning', color: colors.warn, bg: colors.warnBg },
    weak: { label: 'Weak', color: colors.danger, bg: colors.dangerBg },
    ok: { label: 'OK', color: colors.primary, bg: colors.primarySoft },
    strong: { label: 'Strong', color: colors.success, bg: colors.successBg },
  };
  return map;
}

export default function ProgressScreen() {
  const nav = useNavigation<RootNav>();
  const { colors, spacing } = useTheme();
  const qstats = useProgress((s) => s.qstats);
  const sessions = useProgress((s) => s.sessions);
  const resetAll = useProgress((s) => s.resetAll);
  const statusMeta = useStatusMeta();

  const tm = topicMastery(qstats);
  const tmById = Object.fromEntries(tm.map((t) => [t.topicId, t]));
  const answered = Object.values(qstats).filter((s) => s.seen > 0).length;
  let seen = 0;
  let correct = 0;
  for (const s of Object.values(qstats)) {
    seen += s.seen;
    correct += s.correct;
  }
  const overall = seen ? correct / seen : 0;
  const strong = tm.filter((t) => t.status === 'strong').length;

  const confirmReset = () =>
    Alert.alert('Reset all progress?', 'This clears every answer, session, and mastery stat. It cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetAll() },
    ]);

  return (
    <Screen>
      <AppText variant="label">Progress</AppText>
      <AppText variant="title">Your mastery</AppText>

      <Card style={{ marginTop: spacing.lg }}>
        <Row justify="space-between">
          <View style={{ alignItems: 'center', flex: 1 }}>
            <AppText variant="h2">{answered}</AppText>
            <AppText variant="muted">of {questions.length} seen</AppText>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <AppText variant="h2" color={overall >= 0.72 ? colors.success : colors.text}>
              {seen ? `${Math.round(overall * 100)}%` : '—'}
            </AppText>
            <AppText variant="muted">accuracy</AppText>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <AppText variant="h2">
              {strong}/{tm.length}
            </AppText>
            <AppText variant="muted">topics strong</AppText>
          </View>
        </Row>
      </Card>

      {domains.map((d) => (
        <View key={d.id}>
          <SectionHeader title={d.name} />
          <Card padded={false}>
            {topicsForDomain(d.id).map((t, i, arr) => {
              const m = tmById[t.id];
              const meta = statusMeta[m.status];
              return (
                <View key={t.id}>
                  <Row justify="space-between" style={{ padding: spacing.md }}>
                    <View style={{ flex: 1, paddingRight: spacing.sm }}>
                      <AppText variant="h3" numberOfLines={1} style={{ fontSize: 15 }}>
                        {t.name}
                      </AppText>
                      <Row gap={8} style={{ marginTop: 6 }}>
                        <View style={{ width: 90 }}>
                          <ProgressBar value={m.accuracy} color={domainColor(d.id)} height={6} />
                        </View>
                        <AppText variant="muted" style={{ fontSize: 12 }}>
                          {m.attempts ? `${Math.round(m.accuracy * 100)}% · ${m.attempts} tries` : 'not started'}
                        </AppText>
                      </Row>
                    </View>
                    <Pill label={meta.label} bg={meta.bg} color={meta.color} />
                  </Row>
                  {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md }} /> : null}
                </View>
              );
            })}
          </Card>
        </View>
      ))}

      {sessions.length ? (
        <>
          <SectionHeader title="Recent sessions" />
          <Card padded={false}>
            {sessions.slice(0, 8).map((s, i, arr) => (
              <View key={s.id}>
                <Row justify="space-between" style={{ padding: spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <AppText style={{ fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
                      {s.scopeLabel}
                    </AppText>
                    <AppText variant="muted" style={{ fontSize: 12 }}>
                      {new Date(s.at).toLocaleDateString()} · {new Date(s.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </AppText>
                  </View>
                  <AppText variant="mono" color={s.correct / s.total >= 0.72 ? colors.success : colors.textMuted}>
                    {s.correct}/{s.total}
                  </AppText>
                </Row>
                {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md }} /> : null}
              </View>
            ))}
          </Card>
        </>
      ) : null}

      <Divider />
      <Button title="Reset all progress" variant="danger" onPress={confirmReset} />
    </Screen>
  );
}
