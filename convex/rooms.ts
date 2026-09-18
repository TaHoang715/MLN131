import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: { roomId: v.id("mlnRooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const getPlayers = query({
  args: { roomId: v.id("mlnRooms") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mlnPlayers")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

export const getPlayer = query({
  args: { playerId: v.id("mlnPlayers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.playerId);
  },
});

export const create = mutation({
  args: {
    hostName: v.string(),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate unique 5-digit room PIN
    let code = "";
    let isUnique = false;
    while (!isUnique) {
      code = Math.floor(10000 + Math.random() * 90000).toString();
      const existing = await ctx.db
        .query("mlnRooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .first();
      if (!existing) isUnique = true;
    }

    const roomId = await ctx.db.insert("mlnRooms", {
      code,
      hostName: args.hostName.trim() || "Giảng viên / Quản trò",
      status: "lobby",
      currentRound: 1,
      phase: "choosing",
      randomEvent: null,
      startedAt: Date.now(),
    });

    const playerId = await ctx.db.insert("mlnPlayers", {
      name: args.hostName.trim() || "Quản trò",
      roomId,
      isHost: true,
      score: 0,
      lastScoreIncrement: 0,
      currentChoice: null,
      isAlive: true,
      hasSubmitted: false,
    });

    return { roomId, playerId, code };
  },
});

export const join = mutation({
  args: {
    code: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanCode = args.code.trim();
    const cleanName = args.name.trim();

    if (!cleanCode) throw new Error("Vui lòng nhập mã PIN phòng.");
    if (!cleanName) throw new Error("Vui lòng nhập họ & tên của bạn.");

    const room = await ctx.db
      .query("mlnRooms")
      .withIndex("by_code", (q) => q.eq("code", cleanCode))
      .first();

    if (!room) {
      throw new Error("Không tìm thấy phòng chơi với mã PIN này.");
    }

    if (room.status === "finished") {
      throw new Error("Phòng chơi này đã kết thúc.");
    }

    // Check if name is already taken in this room
    const existingPlayers = await ctx.db
      .query("mlnPlayers")
      .withIndex("by_roomId", (q) => q.eq("roomId", room._id))
      .collect();

    const duplicate = existingPlayers.find(
      (p) => p.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      // Re-join as existing player
      return { roomId: room._id, playerId: duplicate._id };
    }

    const playerId = await ctx.db.insert("mlnPlayers", {
      name: cleanName,
      roomId: room._id,
      isHost: false,
      score: 0,
      lastScoreIncrement: 0,
      currentChoice: null,
      isAlive: true,
      hasSubmitted: false,
    });

    return { roomId: room._id, playerId };
  },
});

export const leave = mutation({
  args: { playerId: v.id("mlnPlayers") },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) return;

    if (player.isHost) {
      // If host leaves, finish room
      await ctx.db.patch(player.roomId, { status: "finished" });
    }
    await ctx.db.delete(args.playerId);
  },
});
