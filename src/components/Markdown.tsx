import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/theme';

// Minimal markdown renderer covering what our "learn" notes use: ## / ### headings,
// - / * bullets, blank-line paragraphs, and inline **bold** and `code`.
function renderInline(text: string, keyBase: string, color: string, boldColor: string, codeBg: string) {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(<Text key={`${keyBase}-t${i++}`}>{text.slice(last, m.index)}</Text>);
    const tok = m[0];
    if (tok.startsWith('**')) {
      nodes.push(
        <Text key={`${keyBase}-b${i++}`} style={{ fontWeight: '800', color: boldColor }}>
          {tok.slice(2, -2)}
        </Text>,
      );
    } else {
      nodes.push(
        <Text
          key={`${keyBase}-c${i++}`}
          style={{ fontFamily: 'monospace', backgroundColor: codeBg, color: boldColor, fontSize: 13 }}
        >
          {' '}
          {tok.slice(1, -1)}{' '}
        </Text>,
      );
    }
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(<Text key={`${keyBase}-t${i++}`}>{text.slice(last)}</Text>);
  return nodes;
}

export function Markdown(props: { source: string }) {
  const { colors, spacing, fontSize } = useTheme();
  const lines = props.source.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let key = 0;

  for (let idx = 0; idx < lines.length; idx++) {
    const raw = lines[idx];
    const line = raw.trim();
    if (line === '') continue;

    if (line.startsWith('### ')) {
      blocks.push(
        <Text key={key++} style={{ fontSize: fontSize.md, fontWeight: '800', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs }}>
          {line.slice(4)}
        </Text>,
      );
    } else if (line.startsWith('## ')) {
      blocks.push(
        <Text key={key++} style={{ fontSize: fontSize.lg, fontWeight: '800', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs }}>
          {line.slice(3)}
        </Text>,
      );
    } else if (/^[-*]\s+/.test(line)) {
      blocks.push(
        <View key={key++} style={{ flexDirection: 'row', marginBottom: spacing.xs, paddingRight: spacing.sm }}>
          <Text style={{ color: colors.primary, marginRight: spacing.sm, lineHeight: 22 }}>•</Text>
          <Text style={{ flex: 1, color: colors.text, fontSize: fontSize.md, lineHeight: 22 }}>
            {renderInline(line.replace(/^[-*]\s+/, ''), `b${key}`, colors.text, colors.text, colors.cardAlt)}
          </Text>
        </View>,
      );
    } else {
      blocks.push(
        <Text key={key++} style={{ color: colors.text, fontSize: fontSize.md, lineHeight: 22, marginBottom: spacing.sm }}>
          {renderInline(line, `p${key}`, colors.text, colors.text, colors.cardAlt)}
        </Text>,
      );
    }
  }

  return <View>{blocks}</View>;
}
