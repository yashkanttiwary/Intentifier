import { z } from 'zod';

export const clarifyIntentSchema = z.object({
  schemaVersion: z.string(),
  type: z.literal('clarification_questions'),
  intentSummary: z.string(),
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      purpose: z.string(),
      answerType: z.enum(['short_text', 'single_choice', 'multi_choice', 'scale']),
      options: z.array(z.string()).optional(),
      required: z.boolean(),
    })
  ).min(5).max(6),
  safetyFlags: z.object({
    hasHarmfulIntent: z.boolean(),
    needsSensitiveHandling: z.boolean(),
    reason: z.string().optional(),
  }),
  fallbackMessage: z.string(),
  confidence: z.number().min(0).max(1),
});

export const activationPlanSchema = z.object({
  schemaVersion: z.string(),
  type: z.literal('activation_plan'),
  intentSummary: z.string(),
  planTitle: z.string(),
  durationDays: z.number(),
  difficulty: z.enum(['easy', 'medium', 'challenging']),
  emotionalWhy: z.string(),
  successDefinition: z.string(),
  days: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      mainQuest: z.object({
        id: z.string(),
        action: z.string(),
        estimatedMinutes: z.number(),
        completionCriteria: z.string(),
        whyItMatters: z.string(),
        xp: z.number(),
      }),
      optionalMicroActions: z.array(
        z.object({
          id: z.string(),
          action: z.string(),
          estimatedMinutes: z.number(),
          xp: z.number(),
        })
      ).optional(),
      reflectionQuestion: z.string(),
      momentumMessage: z.string(),
    })
  ),
  gamification: z.object({
    startingLevel: z.number(),
    totalPossibleXp: z.number(),
    streakTargetDays: z.number(),
    momentumRule: z.string(),
  }),
  safetyFlags: z.object({
    hasHarmfulIntent: z.boolean(),
    needsSensitiveHandling: z.boolean(),
    reason: z.string().optional(),
  }),
  fallbackMessage: z.string(),
  confidence: z.number().min(0).max(1),
});

export const rewardsSchema = z.object({
  schemaVersion: z.string(),
  type: z.literal('reward_options'),
  rewardLogic: z.string(),
  rewards: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      category: z.enum(['comfort', 'identity', 'creative', 'social', 'progress']),
      estimatedCost: z.enum(['free', 'low', 'medium', 'high']),
      unlockCondition: z.string(),
      whyItWorks: z.string(),
      safetyNote: z.string().optional(),
    })
  ).length(5),
  safetyFlags: z.object({
    hasUnsafeReward: z.boolean(),
    filteredRewards: z.array(z.string()).optional(),
    reason: z.string().optional(),
  }),
  fallbackMessage: z.string(),
  confidence: z.number().min(0).max(1),
});
