import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { NoteSections } from '../components/NoteSections';
import { AppText, Button, Card, Pill, Row, Screen, SectionHeader } from '../components/ui';
import { comparisons, getDomain, getServiceByName, getTopic, questionsForTopic } from '../content/repository';
import type { RootNav, RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/theme';

const KEY_POINT_LIMIT = 7;

export default function TopicDetailScreen() {
  const nav = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'TopicDetail'>>();
  const { colors, spacing } = useTheme();
  const [showAllKeyPoints, setShowAllKeyPoints] = useState(false);
  const topic = getTopic(route.params.topicId);

  if (!topic) {
    return (
      <Screen scroll={false}>
        <AppText variant="h3">Topic not found</AppText>
      </Screen>
    );
  }

  const domain = getDomain(topic.domainId);
  const qCount = questionsForTopic(topic.id).length;
  const svc = new Set(topic.services.map((s) => s.toLowerCase()));
  const related = comparisons.filter(
    (c) => c.domainId === topic.domainId || c.tags.some((t) => svc.has(t.toLowerCase())),
  );

  return (
    <Screen>
      <Row justify="space-between" style={{ marginBottom: spacing.sm }}>
        <AppText variant="label">{domain?.name ?? 'Topic'}</AppText>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <AppText variant="h3" color={colors.textMuted}>
            ✕
          </AppText>
        </Pressable>
      </Row>
      <AppText variant="title">{topic.name}</AppText>
      {topic.taskId ? (
        <Pill
          label={`Task ${topic.taskId} · ${topic.taskTitle ?? ''}`}
          bg={colors.primarySoft}
          color={colors.primary}
          style={{ marginTop: spacing.sm }}
        />
      ) : null}
      <AppText variant="muted" style={{ marginTop: spacing.xs }}>
        {topic.summary}
      </AppText>

      {topic.keyPoints.length ? (
        <Card style={{ marginTop: spacing.lg, backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
          <Row justify="space-between">
            <AppText variant="label" color={colors.primary}>
              Exam takeaways
            </AppText>
            <AppText variant="label" color={colors.primary}>
              {topic.keyPoints.length}
            </AppText>
          </Row>
          <View style={{ marginTop: spacing.sm, gap: 6 }}>
            {(showAllKeyPoints ? topic.keyPoints : topic.keyPoints.slice(0, KEY_POINT_LIMIT)).map((k, i) => (
              <Row key={i} align="flex-start" gap={8}>
                <AppText color={colors.primary} style={{ fontWeight: '800' }}>
                  ✓
                </AppText>
                <AppText style={{ flex: 1 }}>{k}</AppText>
              </Row>
            ))}
          </View>
          {topic.keyPoints.length > KEY_POINT_LIMIT ? (
            <Pressable onPress={() => setShowAllKeyPoints((v) => !v)} hitSlop={8} style={{ marginTop: spacing.sm }}>
              <AppText color={colors.primary} style={{ fontWeight: '700', fontSize: 13 }}>
                {showAllKeyPoints ? 'Show less' : `Show all ${topic.keyPoints.length} key points`}
              </AppText>
            </Pressable>
          ) : null}
        </Card>
      ) : null}

      {topic.triggers && topic.triggers.length ? (
        <>
          <SectionHeader title="Signal words" />
          <View style={{ gap: spacing.sm }}>
            {topic.triggers.map((t, i) => (
              <Card key={i} style={{ backgroundColor: colors.warnBg, borderColor: colors.warnBg }}>
                <AppText variant="label" color={colors.warn}>
                  When you see
                </AppText>
                <AppText style={{ marginTop: spacing.xs }}>{t.when}</AppText>
                <AppText variant="label" color={colors.warn} style={{ marginTop: spacing.sm }}>
                  Pick
                </AppText>
                <AppText style={{ marginTop: spacing.xs, fontWeight: '600' }}>{t.pick}</AppText>
              </Card>
            ))}
          </View>
        </>
      ) : null}

      <SectionHeader title="Study note" />
      <NoteSections text={topic.learn} />

      {topic.services.length ? (
        <>
          <SectionHeader title="Services" />
          <Row gap={8} style={{ flexWrap: 'wrap' }}>
            {topic.services.map((s) => {
              const matched = getServiceByName(s);
              return (
                <Pill
                  key={s}
                  label={s}
                  onPress={matched ? () => nav.navigate('ServiceDetail', { serviceId: matched.id }) : undefined}
                />
              );
            })}
          </Row>
        </>
      ) : null}

      {related.length ? (
        <>
          <SectionHeader title="Watch out for" />
          <View style={{ gap: spacing.sm }}>
            {related.map((c) => (
              <Card key={c.id} onPress={() => nav.navigate('Compare', { id: c.id })}>
                <Row justify="space-between">
                  <AppText variant="h3" style={{ flex: 1, paddingRight: spacing.sm }} numberOfLines={2}>
                    {c.title}
                  </AppText>
                  <AppText color={colors.textMuted}>→</AppText>
                </Row>
              </Card>
            ))}
          </View>
        </>
      ) : null}

      <Button
        title={`Practice this topic (${qCount})`}
        size="lg"
        onPress={() => nav.navigate('Quiz', { scope: { kind: 'topic', id: topic.id }, title: topic.name })}
        style={{ marginTop: spacing.xl }}
      />
    </Screen>
  );
}
