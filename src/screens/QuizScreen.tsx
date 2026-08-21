import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AppText, Button, Card, Pill, ProgressBar, Row, Screen } from '../components/ui';
import { getComparison } from '../content/repository';
import type { Question } from '../content/types';
import { buildQuiz, isAnswerCorrect } from '../logic/quiz';
import type { RootNav, RootStackParamList } from '../navigation/types';
import { useProgress } from '../store/progressStore';
import { useQuiz } from '../store/quizStore';
import { useTheme } from '../theme/theme';

const DIFF_LABEL = { 1: 'Easy', 2: 'Medium', 3: 'Hard' } as const;

export default function QuizScreen() {
  const nav = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'Quiz'>>();
  const { colors, spacing, radius } = useTheme();

  const start = useQuiz((s) => s.start);
  const toggleOption = useQuiz((s) => s.toggleOption);
  const reveal = useQuiz((s) => s.reveal);
  const next = useQuiz((s) => s.next);
  const finish = useQuiz((s) => s.finish);
  const questions = useQuiz((s) => s.questions);
  const index = useQuiz((s) => s.index);
  const selected = useQuiz((s) => s.selected);
  const revealed = useQuiz((s) => s.revealed);

  const recordAttempt = useProgress((s) => s.recordAttempt);
  const recordSession = useProgress((s) => s.recordSession);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { scope, title, count } = route.params;
    const qs = buildQuiz(scope, useProgress.getState().qstats, count ?? 10);
    const domainId = scope.kind === 'domain' ? scope.id : undefined;
    start(qs, title, domainId);
    setReady(true);
    // build once per screen mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <Screen scroll={false}>
        <AppText variant="muted">Loading…</AppText>
      </Screen>
    );
  }

  if (questions.length === 0) {
    return (
      <Screen scroll={false}>
        <Card>
          <AppText variant="h3">No questions here yet</AppText>
          <AppText variant="muted" style={{ marginTop: spacing.xs }}>
            There aren’t enough questions for this selection. Try another domain or mixed practice.
          </AppText>
          <Button title="Go back" variant="secondary" onPress={() => nav.goBack()} style={{ marginTop: spacing.lg }} />
        </Card>
      </Screen>
    );
  }

  const q: Question = questions[index];
  const isRevealed = !!revealed[q.id];
  const sel = selected[q.id] ?? [];
  const multi = q.type === 'multi';
  const isLast = index >= questions.length - 1;

  const onSubmit = () => {
    reveal(q.id);
    recordAttempt(q.id, isAnswerCorrect(q, sel));
  };

  const onNext = () => {
    if (isLast) {
      const result = finish();
      recordSession({ scopeLabel: result.scopeLabel, domainId: result.domainId, total: result.total, correct: result.correct });
      nav.replace('Results');
    } else {
      next();
    }
  };

  return (
    <Screen>
      {/* header */}
      <Row justify="space-between" style={{ marginBottom: spacing.sm }}>
        <Pressable onPress={() => nav.goBack()} hitSlop={10}>
          <AppText variant="h3" color={colors.textMuted}>
            ✕
          </AppText>
        </Pressable>
        <AppText variant="label">
          {index + 1} / {questions.length}
        </AppText>
      </Row>
      <ProgressBar value={(index + (isRevealed ? 1 : 0)) / questions.length} />

      <Row gap={8} style={{ marginTop: spacing.lg }}>
        <Pill label={DIFF_LABEL[q.difficulty]} />
        {multi ? <Pill label="Select all that apply" bg={colors.primarySoft} color={colors.primary} /> : null}
      </Row>

      <AppText variant="h2" style={{ marginTop: spacing.md, lineHeight: 28 }}>
        {q.stem}
      </AppText>

      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        {q.options.map((opt) => {
          const chosen = sel.includes(opt.id);
          const correct = q.correct.includes(opt.id);
          let bg = colors.card;
          let border = colors.border;
          let mark = '';
          if (isRevealed) {
            if (correct) {
              bg = colors.successBg;
              border = colors.success;
              mark = '✓';
            } else if (chosen) {
              bg = colors.dangerBg;
              border = colors.danger;
              mark = '✕';
            }
          } else if (chosen) {
            bg = colors.primarySoft;
            border = colors.primary;
          }
          return (
            <Pressable
              key={opt.id}
              disabled={isRevealed}
              onPress={() => toggleOption(q.id, opt.id, multi)}
              style={{
                backgroundColor: bg,
                borderColor: border,
                borderWidth: 1.5,
                borderRadius: radius.md,
                padding: spacing.md,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: spacing.sm,
              }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: multi ? 7 : 13,
                  borderWidth: 1.5,
                  borderColor: chosen || (isRevealed && correct) ? border : colors.border,
                  backgroundColor: chosen || (isRevealed && correct) ? border : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AppText color={colors.card} style={{ fontWeight: '800', fontSize: 13 }}>
                  {isRevealed ? mark : chosen ? (multi ? '✓' : '•') : ''}
                </AppText>
              </View>
              <AppText style={{ flex: 1 }}>{opt.text}</AppText>
            </Pressable>
          );
        })}
      </View>

      {isRevealed ? (
        <Card style={{ marginTop: spacing.lg, backgroundColor: colors.cardAlt, borderColor: colors.border }}>
          <AppText variant="label" color={isAnswerCorrect(q, sel) ? colors.success : colors.danger}>
            {isAnswerCorrect(q, sel) ? 'Correct' : 'Not quite'}
          </AppText>
          <AppText variant="body" style={{ marginTop: spacing.xs }}>
            {q.explanation}
          </AppText>
          {q.inShort ? (
            <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}>
              <AppText variant="label" color={colors.primary}>
                In short
              </AppText>
              <AppText variant="body" style={{ marginTop: spacing.xs }}>
                {q.inShort}
              </AppText>
            </View>
          ) : null}
          {q.references && q.references.length ? (
            <View style={{ marginTop: spacing.md }}>
              <AppText variant="label">References</AppText>
              {q.references.map((ref, i) => (
                <AppText key={i} variant="muted" style={{ marginTop: 2 }}>
                  {ref}
                </AppText>
              ))}
            </View>
          ) : null}
        </Card>
      ) : null}

      {isRevealed && !isAnswerCorrect(q, sel) && q.trap ? (
        <Card style={{ marginTop: spacing.md, backgroundColor: colors.warnBg, borderColor: colors.warnBg }}>
          <AppText variant="label" color={colors.warn}>
            The trap
          </AppText>
          <AppText variant="body" style={{ marginTop: spacing.xs }}>
            {q.trap}
          </AppText>
        </Card>
      ) : null}

      {isRevealed && q.confusableId && getComparison(q.confusableId) ? (
        <Card
          style={{ marginTop: spacing.md, backgroundColor: colors.primarySoft, borderColor: colors.primarySoft }}
          onPress={() => nav.navigate('Compare', { id: q.confusableId })}
        >
          <Row justify="space-between">
            <View style={{ flex: 1, paddingRight: spacing.sm }}>
              <AppText variant="label" color={colors.primary}>
                Confusable
              </AppText>
              <AppText variant="h3" style={{ marginTop: spacing.xs }} numberOfLines={2}>
                {getComparison(q.confusableId)?.title}
              </AppText>
            </View>
            <AppText color={colors.primary}>→</AppText>
          </Row>
        </Card>
      ) : null}

      <View style={{ marginTop: spacing.lg }}>
        {isRevealed ? (
          <Button title={isLast ? 'See results' : 'Next question'} size="lg" onPress={onNext} />
        ) : (
          <Button title="Submit answer" size="lg" disabled={sel.length === 0} onPress={onSubmit} />
        )}
      </View>
    </Screen>
  );
}
