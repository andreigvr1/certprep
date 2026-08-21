import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { AppText, Card, Row, Screen, SectionHeader } from '../components/ui';
import { getPattern, getService } from '../content/repository';
import type { RootNav, RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/theme';

export default function PatternDetailScreen() {
  const nav = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'PatternDetail'>>();
  const { colors, spacing } = useTheme();
  const pattern = getPattern(route.params.patternId);

  if (!pattern) {
    return (
      <Screen scroll={false}>
        <AppText variant="h3">Pattern not found</AppText>
      </Screen>
    );
  }

  const accent =
    pattern.category === 'Security'
      ? colors.danger
      : pattern.category === 'Performance'
        ? colors.success
        : pattern.category === 'Cost'
          ? colors.warn
          : colors.primary;

  return (
    <Screen>
      <Row justify="space-between" style={{ marginBottom: spacing.sm }}>
        <AppText variant="label" color={accent}>
          {pattern.category} pattern
        </AppText>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <AppText variant="h3" color={colors.textMuted}>
            ✕
          </AppText>
        </Pressable>
      </Row>
      <AppText variant="title">{pattern.name}</AppText>

      <SectionHeader title="When you'd reach for this" />
      <Card>
        <AppText>{pattern.problem}</AppText>
      </Card>

      <SectionHeader title="The recipe" />
      <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}>
        <AppText>{pattern.solution}</AppText>
      </Card>

      {pattern.watchOutFor ? (
        <>
          <SectionHeader title="Watch out for" />
          <Card style={{ backgroundColor: colors.warnBg, borderColor: colors.warnBg }}>
            <AppText>{pattern.watchOutFor}</AppText>
          </Card>
        </>
      ) : null}

      {pattern.serviceIds.length ? (
        <>
          <SectionHeader title="Services involved" />
          <View style={{ gap: spacing.sm }}>
            {pattern.serviceIds.map((id) => {
              const svc = getService(id);
              if (!svc) return null;
              return (
                <Card key={id} onPress={() => nav.navigate('ServiceDetail', { serviceId: id })}>
                  <Row justify="space-between">
                    <View style={{ flex: 1, paddingRight: spacing.sm }}>
                      <AppText variant="h3" style={{ fontSize: 15 }}>
                        {svc.name}
                      </AppText>
                      <AppText variant="muted" style={{ marginTop: 2 }} numberOfLines={1}>
                        {svc.oneLiner}
                      </AppText>
                    </View>
                    <AppText color={colors.textMuted}>→</AppText>
                  </Row>
                </Card>
              );
            })}
          </View>
        </>
      ) : null}
    </Screen>
  );
}
