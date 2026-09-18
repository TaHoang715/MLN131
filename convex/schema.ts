import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Dedicated Tables for MLN131 Game (Dân Chủ XHCN & Nhà Nước XHCN)
  mlnRooms: defineTable({
    code: v.string(),
    hostName: v.optional(v.string()),
    status: v.union(
      v.literal("lobby"),
      v.literal("playing"),
      v.literal("finished")
    ),
    currentRound: v.number(), // 1 -> 10
    phase: v.union(v.literal("choosing"), v.literal("results")),
    randomEvent: v.union(v.string(), v.null()),
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
    durationSeconds: v.optional(v.number()),
  }).index("by_code", ["code"]),

  mlnPlayers: defineTable({
    name: v.string(),
    roomId: v.id("mlnRooms"),
    isHost: v.boolean(),
    score: v.optional(v.number()),
    lastScoreIncrement: v.optional(v.number()),
    currentChoice: v.union(v.string(), v.null()),
    isAlive: v.boolean(),
    hasSubmitted: v.boolean(),
  }).index("by_roomId", ["roomId"]),

  // Preserved tables from previous projects to prevent any schema collision
  rooms: defineTable({
    code: v.string(),
    status: v.string(),
    currentRound: v.number(),
    phase: v.string(),
    randomEvent: v.optional(v.union(v.string(), v.null())),
    hostName: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
    durationSeconds: v.optional(v.number()),
  }).index("by_code", ["code"]),

  players: defineTable({
    name: v.string(),
    roomId: v.id("rooms"),
    isHost: v.boolean(),
    score: v.optional(v.number()),
    lastScoreIncrement: v.optional(v.number()),
    currentChoice: v.optional(v.union(v.string(), v.null())),
    isAlive: v.optional(v.boolean()),
    hasSubmitted: v.optional(v.boolean()),
    money: v.optional(v.number()),
    alienation: v.optional(v.number()),
    freedom: v.optional(v.number()),
    inSurvivalCrisis: v.optional(v.boolean()),
  }).index("by_roomId", ["roomId"]),

  dbpRooms: defineTable({
    code: v.string(),
    hostName: v.string(),
    status: v.string(),
    currentRound: v.number(),
    day: v.number(),
    dayName: v.string(),
    sam2Ammo: v.number(),
    artilleryAmmo: v.number(),
    radarStatus: v.string(),
    cityDamage: v.number(),
    score: v.number(),
    b52Kills: v.number(),
    tacticalKills: v.number(),
    waveStatus: v.string(),
    phase: v.string(),
  }).index("by_code", ["code"]),

  dbpPlayers: defineTable({
    name: v.string(),
    roomId: v.id("dbpRooms"),
    role: v.string(),
    isHost: v.boolean(),
    score: v.number(),
    questionsAnswered: v.number(),
    correctAnswers: v.number(),
    currentQuestionId: v.optional(v.number()),
  }).index("by_roomId", ["roomId"]),

  dbpBattleLogs: defineTable({
    roomId: v.id("dbpRooms"),
    text: v.string(),
    type: v.string(),
    timestamp: v.number(),
  }).index("by_roomId", ["roomId"]),

  dbpQuizQuestions: defineTable({
    questionId: v.number(),
    planeId: v.string(),
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.string(),
    explanation: v.string(),
    ammoReward: v.number(),
    ammoType: v.string(),
  }).index("by_questionId", ["questionId"]),
});
