import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { AppText, Card, Row, Screen, weaknessTone } from '../components/ui';
import { comparisons } from '../content/repository';
import type { Comparison } from '../content/types';
import { byWeaknessScore, comparisonWeaknessMap } from '../logic/mastery';
import type { RootStackParamList } from '../navigation/types';
import { useProgress } from '../store/progressStore';
import { useTheme } from '../theme/theme';

function ColumnTable({ c }: { c: Comparison }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View>
      <Row gap={spacing.sm} style={{ marginBottom: spacing.sm }}>
        {c.items.map((name) => (
          <View key={name} style={{ flex: 1 }}>
            <AppText variant="h3" style={{ fontSize: 15 }}>
              {name}
            </AppText>
          </View>
        ))}
      </Row>
      {c.rows.map((r) => (
        <View key={r.label} style={{ marginBottom: spacing.md }}>
          <AppText variant="label" style={{ marginBottom: 6 }}>
            {r.label}
          </AppText>
          <Row gap={spacing.sm} align="flex-start">
            {r.values.map((v, i) => (
              <View
                key={i}
                style={{ flex: 1, backgroundColor: colors.cardAlt, borderRadius: radius.sm, padding: spacing.sm, minHeight: 54 }}
              >
                <AppText style={{ fontSize: 13, lineHeight: 18 }}>{v}</AppText>
              </View>
            ))}
          </Row>
        </View>
      ))}
    </View>
  );
}

function StackedCards({ c }: { c: Comparison }) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      {c.items.map((name, i) => (
        <Card key={name} style={{ backgroundColor: colors.cardAlt, borderColor: colors.cardAlt }}>
          <AppText variant="h3" style={{ marginBottom: spacing.sm, fontSize: 16 }}>
            {name}
          </AppText>
          {c.rows.map((r) => (
            <Row key={r.label} align="flex-start" justify="space-between" style={{ marginBottom: 6 }}>
              <AppText variant="muted" style={{ width: 110, fontSize: 12 }}>
                {r.label}
              </AppText>
              <AppText style={{ flex: 1, fontSize: 13 }}>{r.values[i]}</AppText>
            </Row>
          ))}
        </Card>
      ))}
    </View>
  );
}

export default function CompareScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Compare'>>();
  const nav = useNavigation();
  const { colors, spacing, radius } = useTheme();
  const qstats = useProgress((s) => s.qstats);
  const cmpScore = comparisonWeaknessMap(qstats);
  const sortedComparisons = [...comparisons].sort(byWeaknessScore(cmpScore));
  const initial = route.params?.id && comparisons.some((c) => c.id === route.params?.id) ? route.params.id : sortedComparisons[0].id;
  const [selectedId, setSelectedId] = useState<string>(initial);
  const c = comparisons.find((x) => x.id === selectedId) ?? sortedComparisons[0];

  return (
    <Screen>
      <Row justify="space-between" style={{ marginBottom: spacing.sm }}>
        <AppText variant="label">Confusables</AppText>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <AppText variant="h3" color={colors.textMuted}>
            ✕
          </AppText>
        </Pressable>
      </Row>

      <AppText variant="muted" style={{ marginTop: spacing.xs }}>
        Sorted weakest first — the dot shows how you've scored on each mix-up.
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingTop: spacing.sm, paddingBottom: spacing.sm }}>
        {sortedComparisons.map((cmp) => {
          const active = cmp.id === selectedId;
          const tone = weaknessTone(cmpScore[cmp.id], colors);
          return (
            <Pressable
              key={cmp.id}
              onPress={() => setSelectedId(cmp.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: active ? colors.primary : colors.cardAlt,
                borderRadius: radius.pill,
                paddingHorizontal: spacing.md,
                paddingVertical: 8,
              }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: active ? colors.primaryText : tone.fg }} />
              <AppText color={active ? colors.primaryText : colors.textMuted} style={{ fontWeight: '700', fontSize: 13 }}>
                {cmp.title}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      <AppText variant="title" style={{ marginTop: spacing.md }}>
        {c.title}
      </AppText>

      <Card style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        {c.items.length <= 3 ? <ColumnTable c={c} /> : <StackedCards c={c} />}
      </Card>

      <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
        <AppText variant="label" color={colors.primary}>
          Bottom line
        </AppText>
        <AppText style={{ marginTop: spacing.xs }}>{c.bottomLine}</AppText>
      </Card>
    </Screen>
  );
}
