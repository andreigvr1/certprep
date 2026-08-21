import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { QuizScope } from '../logic/quiz';

export type RootStackParamList = {
  Tabs: undefined;
  Quiz: { scope: QuizScope; title: string; count?: number };
  Results: undefined;
  TopicDetail: { topicId: string };
  Compare: { id?: string } | undefined;
  ServiceDetail: { serviceId: string };
  PatternDetail: { patternId: string };
};

export type TabParamList = {
  Home: undefined;
  Practice: undefined;
  Progress: undefined;
  Learn: undefined;
};

export type RootNav = NativeStackNavigationProp<RootStackParamList>;
