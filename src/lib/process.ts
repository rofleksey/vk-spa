import PQueue from "p-queue";
import type { User } from "@/lib/types";
import { getFriends } from "@/lib/vk";
import { getDescription } from "@/lib/util";

async function getDistinctFriends(
  ids: number[],
  queue: PQueue,
  token: string
): Promise<User[]> {
  const friendsTasks = ids.map((id) => () => getFriends(id, 0, token));
  const responses = await queue.addAll(friendsTasks);
  const userMap: Map<number, User> = new Map();
  responses.forEach((resp, i) => {
    const userId = ids[i];
    resp.items.forEach((user) => {
      if (!userMap.has(user.id)) {
        userMap.set(user.id, {
          id: user.id,
          icon: user.photo_200!!,
          name: `${user.first_name} ${user.last_name}`,
          firstName: user.first_name,
          username: user.screen_name!!,
          description: getDescription(user),
          friendOf: [userId],
        });
      } else {
        userMap.get(user.id)!!.friendOf!!.push(userId);
      }
    });
  });
  const result = [];
  for (const user of userMap.values()) {
    result.push(user);
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

export async function processUsers(
  ids: number[],
  token: string
): Promise<User[]> {
  const queue = new PQueue({
    concurrency: 2,
    timeout: 10000,
    throwOnTimeout: true,
    intervalCap: 1,
    carryoverConcurrencyCount: true,
    interval: 333,
  });
  try {
    // await is important
    return await getDistinctFriends(ids, queue, token);
  } finally {
    queue.clear();
  }
}
