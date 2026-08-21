import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText, Card, Pill, Row, Screen, SectionHeader } from '../components/ui';
import { getComparison, getService, patternsForService } from '../content/repository';
import type { RootNav, RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/theme';

export default function ServiceDetailScreen() {
  const nav = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'ServiceDetail'>>();
  const { colors, spacing } = useTheme();
  const service = getService(route.params.serviceId);
  const related = service ? patternsForService(service.id) : [];

  if (!service) {
    return (
      <Screen scroll={false}>
        <AppText variant="h3">Service not found</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <Row justify="space-between" style={{ marginBottom: spacing.sm }}>
        <AppText variant="label">{service.category}</AppText>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <AppText variant="h3" color={colors.textMuted}>
            ✕
          </AppText>
        </Pressable>
      </Row>
      <AppText variant="title">{service.name}</AppText>
      <AppText variant="muted" style={{ marginTop: spacing.xs }}>
        {service.oneLiner}
      </AppText>

      {service.triggers && service.triggers.length ? (
        <>
          <SectionHeader title="If you see this, think this" />
          <View style={{ gap: spacing.sm }}>
            {service.triggers.map((t, i) => (
              <Card key={i} style={{ backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
                <AppText variant="label" color={colors.primary}>
                  When
                </AppText>
                <AppText style={{ marginTop: spacing.xs }}>{t.when}</AppText>
                <AppText variant="label" color={colors.primary} style={{ marginTop: spacing.sm }}>
                  Pick
                </AppText>
                <AppText style={{ marginTop: spacing.xs, fontWeight: '600' }}>{t.pick}</AppText>
              </Card>
            ))}
          </View>
        </>
      ) : null}

      {service.specifics.length ? (
        <>
          <SectionHeader title="The facts that decide questions" />
          <Card>
            <View style={{ gap: 8 }}>
              {service.specifics.map((s, i) => (
                <Row key={i} align="flex-start" gap={8}>
                  <AppText color={colors.textMuted} style={{ fontWeight: '800' }}>
                    ·
                  </AppText>
                  <AppText style={{ flex: 1 }}>{s}</AppText>
                </Row>
              ))}
            </View>
          </Card>
        </>
      ) : null}

      {service.bestFor.length ? (
        <>
          <SectionHeader title="Best for" />
          <Card style={{ backgroundColor: colors.successBg, borderColor: colors.successBg }}>
            <View style={{ gap: 8 }}>
              {service.bestFor.map((s, i) => (
                <Row key={i} align="flex-start" gap={8}>
                  <AppText color={colors.success} style={{ fontWeight: '800' }}>
                    ✓
                  </AppText>
                  <AppText style={{ flex: 1 }}>{s}</AppText>
                </Row>
              ))}
            </View>
          </Card>
        </>
      ) : null}

      {service.watchOutFor && service.watchOutFor.length ? (
        <>
          <SectionHeader title="Watch out for" />
          <Card style={{ backgroundColor: colors.warnBg, borderColor: colors.warnBg }}>
            <View style={{ gap: 8 }}>
              {service.watchOutFor.map((s, i) => (
                <Row key={i} align="flex-start" gap={8}>
                  <AppText color={colors.warn} style={{ fontWeight: '800' }}>
                    !
                  </AppText>
                  <AppText style={{ flex: 1 }}>{s}</AppText>
                </Row>
              ))}
            </View>
          </Card>
        </>
      ) : null}

      {service.distinguishFrom && service.distinguishFrom.length ? (
        <>
          <SectionHeader title="Vs. the services people confuse it with" />
          <View style={{ gap: spacing.sm }}>
            {service.distinguishFrom.map((d, i) => {
              const comparison = d.comparisonId ? getComparison(d.comparisonId) : undefined;
              return (
                <Card key={i} onPress={comparison ? () => nav.navigate('Compare', { id: d.comparisonId }) : undefined}>
                  <Row justify="space-between" align="flex-start">
                    <AppText variant="h3" style={{ flex: 1, paddingRight: spacing.sm, fontSize: 15 }}>
                      {d.service}
                    </AppText>
                    {comparison ? (
                      <AppText color={colors.primary} style={{ fontSize: 12, fontWeight: '700' }}>
                        Compare →
                      </AppText>
                    ) : null}
                  </Row>
                  <AppText variant="muted" style={{ marginTop: spacing.xs }}>
                    {d.note}
                  </AppText>
                </Card>
              );
            })}
          </View>
        </>
      ) : null}

      {related.length ? (
        <>
          <SectionHeader title="Design patterns that use this" />
          <View style={{ gap: spacing.sm }}>
            {related.map((p) => (
              <Card key={p.id} onPress={() => nav.navigate('PatternDetail', { patternId: p.id })}>
                <Row justify="space-between">
                  <AppText variant="h3" style={{ flex: 1, paddingRight: spacing.sm, fontSize: 15 }} numberOfLines={2}>
                    {p.name}
                  </AppText>
                  <AppText color={colors.textMuted}>→</AppText>
                </Row>
              </Card>
            ))}
          </View>
        </>
      ) : null}
    </Screen>
  );
}
