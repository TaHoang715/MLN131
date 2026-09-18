import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const startGame = mutation({
  args: {
    roomId: v.id("mlnRooms"),
    playerId: v.id("mlnPlayers"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player || !player.isHost) {
      throw new Error("Chỉ có Quản trò (Host) mới có quyền bắt đầu trò chơi.");
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Phòng không tồn tại.");

    // Reset all players
    const players = await ctx.db
      .query("mlnPlayers")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const p of players) {
      await ctx.db.patch(p._id, {
        score: 0,
        lastScoreIncrement: 0,
        currentChoice: null,
        hasSubmitted: false,
      });
    }

    await ctx.db.patch(args.roomId, {
      status: "playing",
      currentRound: 1,
      phase: "choosing",
      startedAt: Date.now(),
      finishedAt: undefined,
    });
  },
});

export const submitChoice = mutation({
  args: {
    playerId: v.id("mlnPlayers"),
    answer: v.string(),
    scoreIncrement: v.number(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) throw new Error("Người chơi không tồn tại.");

    const room = await ctx.db.get(player.roomId);
    if (!room || room.status !== "playing" || room.phase !== "choosing") {
      throw new Error("Vòng thi này đã đóng hoặc chưa bắt đầu.");
    }

    if (player.hasSubmitted) {
      return; // Already submitted
    }

    const newScore = (player.score || 0) + args.scoreIncrement;

    await ctx.db.patch(player._id, {
      hasSubmitted: true,
      currentChoice: args.answer,
      lastScoreIncrement: args.scoreIncrement,
      score: newScore,
    });

    // Check if all non-host players have submitted
    const allPlayers = await ctx.db
      .query("mlnPlayers")
      .withIndex("by_roomId", (q) => q.eq("roomId", room._id))
      .collect();

    const nonHosts = allPlayers.filter((p) => !p.isHost);
    const allDone = nonHosts.length > 0 && nonHosts.every((p) => p._id === player._id ? true : p.hasSubmitted);

    if (allDone) {
      await ctx.db.patch(room._id, {
        phase: "results",
      });
    }
  },
});

export const forceProcessRound = mutation({
  args: {
    roomId: v.id("mlnRooms"),
    playerId: v.id("mlnPlayers"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player || !player.isHost) {
      throw new Error("Chỉ quản trò mới có thể kết thúc vòng.");
    }

    await ctx.db.patch(args.roomId, {
      phase: "results",
    });
  },
});

export const nextRound = mutation({
  args: {
    roomId: v.id("mlnRooms"),
    playerId: v.id("mlnPlayers"),
    totalRounds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player || !player.isHost) {
      throw new Error("Chỉ quản trò mới có thể chuyển vòng.");
    }

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Phòng không tồn tại.");

    const maxRounds = args.totalRounds ?? 10;

    if (room.currentRound >= maxRounds) {
      // Finished all rounds
      await ctx.db.patch(args.roomId, {
        status: "finished",
        finishedAt: Date.now(),
      });
    } else {
      // Next round
      const players = await ctx.db
        .query("mlnPlayers")
        .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
        .collect();

      for (const p of players) {
        await ctx.db.patch(p._id, {
          hasSubmitted: false,
          currentChoice: null,
          lastScoreIncrement: 0,
        });
      }

      await ctx.db.patch(args.roomId, {
        currentRound: room.currentRound + 1,
        phase: "choosing",
        startedAt: Date.now(),
      });
    }
  },
});

export const endGame = mutation({
  args: {
    roomId: v.id("mlnRooms"),
    playerId: v.id("mlnPlayers"),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player || !player.isHost) {
      throw new Error("Chỉ quản trò mới có thể kết thúc sớm.");
    }

    await ctx.db.patch(args.roomId, {
      status: "finished",
      finishedAt: Date.now(),
    });
  },
});
