import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';

type TextVariant = 'display' | 'title' | 'h2' | 'h3' | 'body' | 'muted' | 'label' | 'mono';

export function AppText(props: {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  const { colors, fontSize } = useTheme();
  const v = props.variant ?? 'body';
  const map: Record<TextVariant, TextStyle> = {
    display: { fontSize: fontSize.display, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
    h2: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
    h3: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
    body: { fontSize: fontSize.md, fontWeight: '400', color: colors.text, lineHeight: 22 },
    muted: { fontSize: fontSize.sm, fontWeight: '400', color: colors.textMuted, lineHeight: 20 },
    label: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },
    mono: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  };
  return (
    <Text
      numberOfLines={props.numberOfLines}
      style={[map[v], props.center && { textAlign: 'center' }, props.color ? { color: props.color } : null, props.style]}
    >
      {props.children}
    </Text>
  );
}

export function Screen(props: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { colors, spacing } = useTheme();
  const padded = props.padded ?? true;
  const inner = (
    <View style={[padded && { paddingHorizontal: spacing.lg }, props.contentStyle]}>{props.children}</View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={props.edges ?? ['top']}>
      {props.scroll ?? true ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: spacing.xxl * 1.5, paddingTop: spacing.md }}
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingTop: spacing.md }}>{inner}</View>
      )}
    </SafeAreaView>
  );
}

export function Card(props: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
}) {
  const { colors, radius, spacing } = useTheme();
  const base: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: props.padded === false ? 0 : spacing.lg,
  };
  if (props.onPress) {
    return (
      <Pressable
        onPress={props.onPress}
        style={({ pressed }) => [base, pressed && { opacity: 0.7 }, props.style]}
      >
        {props.children}
      </Pressable>
    );
  }
  return <View style={[base, props.style]}>{props.children}</View>;
}

export function Button(props: {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}) {
  const { colors, radius, spacing, fontSize } = useTheme();
  const variant = props.variant ?? 'primary';
  const size = props.size ?? 'md';
  const bg: Record<string, string> = {
    primary: colors.primary,
    secondary: colors.cardAlt,
    ghost: 'transparent',
    danger: colors.dangerBg,
  };
  const fg: Record<string, string> = {
    primary: colors.primaryText,
    secondary: colors.text,
    ghost: colors.primary,
    danger: colors.danger,
  };
  const disabled = props.disabled || props.loading;
  return (
    <Pressable
      onPress={props.onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: bg[variant],
          borderRadius: radius.md,
          paddingVertical: size === 'lg' ? spacing.md + 2 : spacing.md,
          paddingHorizontal: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: colors.border,
        },
        disabled && { opacity: 0.45 },
        pressed && !disabled && { opacity: 0.8 },
        props.style,
      ]}
    >
      {props.loading ? (
        <ActivityIndicator color={fg[variant]} />
      ) : (
        <>
          {props.icon}
          <Text style={{ color: fg[variant], fontWeight: '700', fontSize: size === 'lg' ? fontSize.lg : fontSize.md }}>
            {props.title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export function Pill(props: { label: string; color?: string; bg?: string; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const { colors, radius, spacing } = useTheme();
  const base: ViewStyle = {
    backgroundColor: props.bg ?? colors.cardAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  };
  const label = <Text style={{ color: props.color ?? colors.textMuted, fontSize: 12, fontWeight: '700' }}>{props.label}</Text>;
  if (props.onPress) {
    return (
      <Pressable onPress={props.onPress} style={({ pressed }) => [base, pressed && { opacity: 0.7 }, props.style]}>
        {label}
      </Pressable>
    );
  }
  return <View style={[base, props.style]}>{label}</View>;
}

// Shared color/label logic for the weakest-first ranking pills used in Learn/Services/Confusables.
// score is 0..1 accuracy, or -1 for "not started".
export function weaknessTone(score: number, colors: ReturnType<typeof useTheme>['colors']): { bg: string; fg: string } {
  if (score < 0) return { bg: colors.cardAlt, fg: colors.textMuted };
  if (score < 0.6) return { bg: colors.dangerBg, fg: colors.danger };
  if (score < 0.8) return { bg: colors.warnBg, fg: colors.warn };
  return { bg: colors.successBg, fg: colors.success };
}

export function WeaknessPill(props: { score: number; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  const tone = weaknessTone(props.score, colors);
  const label = props.score < 0 ? 'not started' : `${Math.round(props.score * 100)}%`;
  return <Pill label={label} bg={tone.bg} color={tone.fg} style={props.style} />;
}

export function ProgressBar(props: { value: number; color?: string; height?: number; track?: string }) {
  const { colors, radius } = useTheme();
  const v = Math.max(0, Math.min(1, isFinite(props.value) ? props.value : 0));
  const h = props.height ?? 8;
  return (
    <View style={{ height: h, backgroundColor: props.track ?? colors.track, borderRadius: radius.pill, overflow: 'hidden' }}>
      <View style={{ width: `${v * 100}%`, height: '100%', backgroundColor: props.color ?? colors.primary, borderRadius: radius.pill }} />
    </View>
  );
}

export function Divider() {
  const { colors, spacing } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />;
}

export function Row(props: { children: React.ReactNode; gap?: number; style?: StyleProp<ViewStyle>; align?: 'center' | 'flex-start' | 'flex-end'; justify?: ViewStyle['justifyContent'] }) {
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: props.align ?? 'center', justifyContent: props.justify, gap: props.gap ?? 8 },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
}

export function SectionHeader(props: { title: string; action?: { label: string; onPress: () => void }; style?: StyleProp<ViewStyle> }) {
  const { colors, spacing } = useTheme();
  return (
    <Row justify="space-between" style={[{ marginBottom: spacing.sm, marginTop: spacing.lg }, props.style]}>
      <AppText variant="label">{props.title}</AppText>
      {props.action ? (
        <Pressable onPress={props.action.onPress} hitSlop={8}>
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>{props.action.label}</Text>
        </Pressable>
      ) : null}
    </Row>
  );
}
