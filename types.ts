export interface AnalyticsEvent {
  event_name: 'tile_opened' | 'test_started' | 'test_submitted' | 'test_reset' | 'back_clicked';
  test_id?: number;
  timestamp: number;
  user_id?: string;
  score?: number;
}

export enum TestType {
  DRAG_GAPS = 1,
  MCQ = 2,
  IMAGE_MATCH = 3,
  SENTENCE_BUILDER = 4,
  WORD_BUILDER = 5,
  COLUMNS = 6,
  PLACEHOLDER = 7,
}

export interface TestConfig {
  id: TestType;
  title: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
}

export const TESTS: TestConfig[] = [
  { id: TestType.DRAG_GAPS, title: 'Drag&Drop Gaps', gradientFrom: '#7BE4A6', gradientTo: '#21C1A0', icon: 'Move' },
  { id: TestType.MCQ, title: 'Multiple Choice', gradientFrom: '#6FD3FF', gradientTo: '#4A90E2', icon: 'ListChecks' },
  { id: TestType.IMAGE_MATCH, title: 'Word → Image Matching', gradientFrom: '#FF9A68', gradientTo: '#FF5E5E', icon: 'Image' },
  { id: TestType.SENTENCE_BUILDER, title: 'Make a Sentence', gradientFrom: '#FF7AAD', gradientTo: '#FF63B6', icon: 'Type' },
  { id: TestType.WORD_BUILDER, title: 'Make Word from Letters', gradientFrom: '#7CC1FF', gradientTo: '#5BB0FF', icon: 'Puzzle' },
  { id: TestType.COLUMNS, title: 'Words in Columns', gradientFrom: '#A890FF', gradientTo: '#8A6BFF', icon: 'Columns' },
  { id: TestType.PLACEHOLDER, title: 'Listening Comprehension', gradientFrom: '#E2E8F0', gradientTo: '#CBD5E1', icon: 'Ear' },
];