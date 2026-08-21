import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/theme';
import { Markdown } from './Markdown';
import { AppText, Card } from './ui';

// Study notes are written as "**Lead phrase.** rest of paragraph" per idea, separated by
// blank lines. Instead of rendering that as one long flowing block, split on the blank
// lines and promote each lead phrase to its own small heading card — turns a wall of text
// into a stack of scannable mini-sections (mirrors the browser artifact's renderNoteSections).
const LEAD_RE = /^\*\*([^*]+)\*\*[:.]?\s*([\s\S]*)$/;

export function NoteSections({ text }: { text: string }) {
  const { colors, spacing } = useTheme();
  const blocks = text.split(/\n\n+/).filter((b) => b.trim());

  return (
    <View style={{ gap: spacing.sm }}>
      {blocks.map((b, i) => {
        const m = b.match(LEAD_RE);
        if (m && m[2].trim()) {
          return (
            <Card key={i}>
              <AppText variant="label" color={colors.primary} style={{ marginBottom: spacing.xs }}>
                {m[1]}
              </AppText>
              <Markdown source={m[2]} />
            </Card>
          );
        }
        return (
          <Card key={i}>
            <Markdown source={b} />
          </Card>
        );
      })}
    </View>
  );
}
