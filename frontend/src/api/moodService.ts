// frontend/src/api/moodService.ts
import api from './axios';

export interface LinkedMealSummary {
  id: number;
  meal_type?: string;
  total_calories?: number;
  date?: string;
}

export interface MoodEntry {
  id: number;
  user_id: number;
  mood: string;
  intensity?: number;
  duration?: string;
  tags: string[];
  journal_note?: string;
  meal_id?: number;
  meal?: LinkedMealSummary;
  hunger_level?: string;
  cravings?: string;
  water_intake?: number;
  sleep_hours?: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMoodPayload {
  mood: string;
  intensity?: number;
  duration?: string;
  tags?: string[];
  journal_note?: string;
  meal_id?: number;
  hunger_level?: string;
  cravings?: string;
  water_intake?: number;
  sleep_hours?: number;
  date?: string;
}

export interface UpdateMoodPayload {
  mood?: string;
  intensity?: number;
  duration?: string;
  tags?: string[];
  journal_note?: string;
  meal_id?: number;
  hunger_level?: string;
  cravings?: string;
  water_intake?: number;
  sleep_hours?: number;
  date?: string;
}

export interface MoodAnalytics {
  total_checkins: number;
  average_intensity?: number;
  mood_distribution: Record<string, number>;
  most_frequent_mood?: string;
  intensity_trends: Array<{
    date: string;
    average_intensity?: number;
    checkin_count: number;
    dominant_mood?: string;
  }>;
  top_tags: Array<{
    tag: string;
    count: number;
  }>;
  date_range: {
    from?: string;
    to?: string;
  };
}

export interface FoodMoodConnectionData {
  total_moods_analyzed: number;
  total_meals_analyzed: number;
  linked_meals_count: number;
  mood_calorie_averages: Record<string, {
    average_daily_calories: number;
    recorded_days: number;
  }>;
  hunger_distribution: Record<string, number>;
  cravings_distribution: Record<string, number>;
  insights: string[];
}

export interface AIInsightsResponse {
  summary: string;
  patterns: string[];
  wellness_suggestions: string[];
  disclaimer: string;
  data_points_analyzed: number;
  source: 'gemini' | 'rule_based';
}

export interface TextAnalysisResponse {
  suggested_mood: string;
  confidence_label: string;
  emotional_themes: string[];
  sentiment_score?: number;
  explanation: string;
  disclaimer: string;
}

export const moodService = {
  async getMoods(params?: {
    skip?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    mood?: string;
  }): Promise<MoodEntry[]> {
    const res = await api.get('/moods/', { params });
    return res.data;
  },

  async getMood(id: number): Promise<MoodEntry> {
    const res = await api.get(`/moods/${id}`);
    return res.data;
  },

  async createMood(payload: CreateMoodPayload): Promise<MoodEntry> {
    const res = await api.post('/moods/', payload);
    return res.data;
  },

  async updateMood(id: number, payload: UpdateMoodPayload): Promise<MoodEntry> {
    const res = await api.patch(`/moods/${id}`, payload);
    return res.data;
  },

  async deleteMood(id: number): Promise<void> {
    await api.delete(`/moods/${id}`);
  },

  async getAnalytics(days: number = 30): Promise<MoodAnalytics> {
    const res = await api.get('/moods/analytics', { params: { days } });
    return res.data;
  },

  async getFoodMoodConnection(days: number = 30): Promise<FoodMoodConnectionData> {
    const res = await api.get('/moods/food-connection', { params: { days } });
    return res.data;
  },

  async getAIInsights(days: number = 14, focus?: string): Promise<AIInsightsResponse> {
    const res = await api.post('/moods/insights', { days, focus });
    return res.data;
  },

  async analyzeText(text: string): Promise<TextAnalysisResponse> {
    const res = await api.post('/moods/analyze-text', { text });
    return res.data;
  },
};
