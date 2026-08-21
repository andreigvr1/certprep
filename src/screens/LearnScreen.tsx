import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AppText, Button, Card, Pill, Row, Screen, SectionHeader, WeaknessPill } from '../components/ui';
import { comparisons, domains, getTopic, patternsByCategory, servicesByCategory, topicsForDomain } from '../content/repository';
import { byWeaknessScore, comparisonWeaknessMap, getWeakTopics, serviceWeaknessMap, topicWeaknessMap } from '../logic/mastery';
import type { RootNav } from '../navigation/types';
import { useProgress } from '../store/progressStore';
import { useTheme } from '../theme/theme';

const PATTERN_CATEGORY_COLOR: Record<string, 'danger' | 'primary' | 'success' | 'warn'> = {
  Security: 'danger',
  Resilience: 'primary',
  Performance: 'success',
  Cost: 'warn',
};

export default function LearnScreen() {
  const nav = useNavigation<RootNav>();
  const { colors, spacing } = useTheme();
  const qstats = useProgress((s) => s.qstats);
  const weak = getWeakTopics(qstats).slice(0, 4);
  const serviceGroups = servicesByCategory();
  const [activeCategory, setActiveCategory] = useState(serviceGroups[0]?.category ?? '');
  const activeGroup = serviceGroups.find((g) => g.category === activeCategory) ?? serviceGroups[0];
  const patternGroups = patternsByCategory();

  const topicScore = topicWeaknessMap(qstats);
  const serviceScore = serviceWeaknessMap(qstats);
  const cmpScore = comparisonWeaknessMap(qstats);
  const sortedComparisons = [...comparisons].sort(byWeaknessScore(cmpScore));
  const sortedActiveServices = [...(activeGroup?.services ?? [])].sort(byWeaknessScore(serviceScore));

  return (
    <Screen>
      <AppText variant="label">Learn</AppText>
      <AppText variant="title">Study & review</AppText>

      {/* Focus areas */}
      <SectionHeader title="Your focus areas" />
      {weak.length ? (
        weak.map((t) => {
          const topic = getTopic(t.topicId);
          if (!topic) return null;
          return (
            <Card key={t.topicId} style={{ marginBottom: spacing.sm }}>
              <Row justify="space-between">
                <AppText variant="h3" style={{ flex: 1, paddingRight: spacing.sm }} numberOfLines={2}>
                  {topic.name}
                </AppText>
                <Pill label={t.attempts ? `${Math.round(t.accuracy * 100)}%` : 'new'} bg={colors.dangerBg} color={colors.danger} />
              </Row>
              <Row gap={10} style={{ marginTop: spacing.md }}>
                <Button title="Learn" variant="secondary" onPress={() => nav.navigate('TopicDetail', { topicId: t.topicId })} style={{ flex: 1 }} />
                <Button
                  title="Practice"
                  onPress={() => nav.navigate('Quiz', { scope: { kind: 'topic', id: t.topicId }, title: topic.name })}
                  style={{ flex: 1 }}
                />
              </Row>
            </Card>
          );
        })
      ) : (
        <Card>
          <AppText variant="muted">
            Answer a few questions and your weakest topics show up here with a one-tap “learn this” note.
          </AppText>
        </Card>
      )}

      {/* Confusables */}
      <SectionHeader title="Confusables — tell look-alikes apart" />
      <AppText variant="muted" style={{ marginTop: -spacing.xs, marginBottom: spacing.sm }}>
        Sorted weakest first, based on how you've scored on questions that trip on each mix-up.
      </AppText>
      <View style={{ gap: spacing.sm }}>
        {sortedComparisons.map((c) => (
          <Card key={c.id} onPress={() => nav.navigate('Compare', { id: c.id })}>
            <Row justify="space-between">
              <AppText variant="h3" style={{ flex: 1, paddingRight: spacing.sm }} numberOfLines={2}>
                {c.title}
              </AppText>
              <WeaknessPill score={cmpScore[c.id]} />
            </Row>
          </Card>
        ))}
      </View>

      {/* Service glossary */}
      <SectionHeader title="Service glossary — what to use and why" />
      <AppText variant="muted" style={{ marginTop: -spacing.xs, marginBottom: spacing.sm }}>
        Sorted weakest first within each category, based on how you've scored on questions touching each service.
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: spacing.sm }}>
        {serviceGroups.map((g) => (
          <Pill
            key={g.category}
            label={`${g.category} (${g.services.length})`}
            bg={g.category === activeGroup?.category ? colors.primary : colors.cardAlt}
            color={g.category === activeGroup?.category ? colors.primaryText : colors.textMuted}
            onPress={() => setActiveCategory(g.category)}
          />
        ))}
      </ScrollView>
      <Card padded={false} style={{ marginTop: spacing.sm }}>
        {sortedActiveServices.map((s, i, arr) => (
          <View key={s.id}>
            <Card padded onPress={() => nav.navigate('ServiceDetail', { serviceId: s.id })} style={{ borderWidth: 0, borderRadius: 0, backgroundColor: 'transparent' }}>
              <Row justify="space-between">
                <View style={{ flex: 1, paddingRight: spacing.sm }}>
                  <AppText style={{ fontSize: 15, fontWeight: '600' }} numberOfLines={1}>
                    {s.name}
                  </AppText>
                  <AppText variant="muted" style={{ marginTop: 2 }} numberOfLines={1}>
                    {s.oneLiner}
                  </AppText>
                </View>
                <WeaknessPill score={serviceScore[s.id]} />
              </Row>
            </Card>
            {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md }} /> : null}
          </View>
        ))}
      </Card>

      {/* Design patterns */}
      <SectionHeader title="Design patterns" />
      <View style={{ gap: spacing.sm }}>
        {patternGroups.map((g) => (
          <View key={g.category}>
            {g.patterns.map((p) => (
              <Card key={p.id} onPress={() => nav.navigate('PatternDetail', { patternId: p.id })} style={{ marginBottom: spacing.sm }}>
                <Row justify="space-between">
                  <AppText variant="h3" style={{ flex: 1, paddingRight: spacing.sm, fontSize: 15 }} numberOfLines={1}>
                    {p.name}
                  </AppText>
                  <Pill label={p.category} color={colors[PATTERN_CATEGORY_COLOR[p.category] ?? 'primary']} bg={colors.cardAlt} />
                </Row>
              </Card>
            ))}
          </View>
        ))}
      </View>

      {/* All topics */}
      <SectionHeader title="Study notes" />
      <AppText variant="muted" style={{ marginTop: -spacing.xs, marginBottom: spacing.sm }}>
        Sorted weakest first within each domain — not-yet-started topics lead, then lowest accuracy.
      </AppText>
      {domains.map((d) => (
        <View key={d.id}>
          <SectionHeader title={d.name} />
          <Card padded={false}>
            {[...topicsForDomain(d.id)].sort(byWeaknessScore(topicScore)).map((t, i, arr) => (
              <View key={t.id}>
                <Card padded onPress={() => nav.navigate('TopicDetail', { topicId: t.id })} style={{ borderWidth: 0, borderRadius: 0, backgroundColor: 'transparent' }}>
                  <Row justify="space-between">
                    <AppText style={{ flex: 1, fontSize: 15, fontWeight: '600', paddingRight: spacing.sm }} numberOfLines={1}>
                      {t.name}
                    </AppText>
                    <WeaknessPill score={topicScore[t.id]} />
                  </Row>
                </Card>
                {i < arr.length - 1 ? <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md }} /> : null}
              </View>
            ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}
