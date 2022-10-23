import axios from "axios";
// @ts-ignore
import jsonpAdapter from "axios-jsonp";

const BASE_URL = "https://api.vk.com/method";
const VERSION = 5.131;
const ITEMS_PER_PAGE = 50;
const ITEMS_PER_PAGE_WALL = 20;
const ITEMS_PER_PAGE_LARGE = 5000;

// twittercels will hatemaxx me for this
export const enum Gender {
  FEMALE = 1,
  MALE = 2,
}

export interface VkError {
  error_code: number;
  error_msg: string;
}

export interface VkErrorResult {
  error: VkError;
}

export interface VkOkResult<T> {
  response: T;
}

export type VkResult<T> = VkErrorResult | VkOkResult<T>;

function isError<T>(value: VkResult<T>): value is VkErrorResult {
  return (value as any).error !== undefined;
}

export interface VkCounters {
  friends: number;
}

export interface VkUser {
  id: number;
  first_name: string;
  last_name: string;
  photo_200?: string;
  photo_50?: string;
  screen_name?: string;
  bdate?: string;
  status?: string;
  sex?: Gender;
  followers_count?: number;
  counters?: VkCounters;
  deactivated?: string; // e.g. banned
  can_access_closed: boolean;
  is_closed: boolean;
}

export interface VkUsersResponse {
  count: number;
  items: VkUser[];
}

export interface PhotoSize {
  width: number;
  height: number;
  url: string;
}

export interface PhotoAttachmentPayload {
  sizes: PhotoSize[];
}

export interface Attachment {
  photo?: PhotoAttachmentPayload;
}

export interface VkWallPost {
  id: number;
  from_id: number;
  owner_id: number;
  date: number;
  is_favourite: boolean;
  post_type: string;
  text: string;
  copy_history?: VkWallPost[];
  attachments?: Attachment[];
}

export interface VkGroupObject {
  id: number;
  name: string;
  screen_name: string;
  photo_50?: string;
}

export interface VkWallResponse {
  count: number;
  items: VkWallPost[];
  profiles?: VkUser[];
  groups?: VkGroupObject[];
}

export async function searchUsers(
  query: string,
  page: number,
  token: string
): Promise<VkUsersResponse> {
  const { data }: { data: VkResult<VkUsersResponse> } = await axios({
    url: `${BASE_URL}/users.search`,
    adapter: jsonpAdapter,
    method: "GET",
    params: {
      q: query,
      count: ITEMS_PER_PAGE,
      offset: ITEMS_PER_PAGE * page,
      fields: "photo_200,screen_name",
      access_token: token,
      v: VERSION,
    },
  });
  if (isError(data)) {
    throw new Error(data.error.error_msg);
  }
  return data.response!!;
}

export async function getFriends(
  userId: number,
  page: number,
  token: string
): Promise<VkUsersResponse> {
  const { data }: { data: VkResult<VkUsersResponse> } = await axios({
    url: `${BASE_URL}/friends.get`,
    adapter: jsonpAdapter,
    method: "GET",
    params: {
      user_id: userId,
      count: ITEMS_PER_PAGE_LARGE,
      offset: ITEMS_PER_PAGE_LARGE * page,
      order: "name",
      fields: "photo_200,screen_name,followers_count,sex,bdate",
      access_token: token,
      v: VERSION,
    },
  });
  if (isError(data)) {
    if (data.error.error_msg === "This profile is private") {
      return { count: 0, items: [] };
    }
    throw new Error(data.error.error_msg);
  }
  return data.response!!;
}

export async function getUser(userId: number, token: string): Promise<VkUser> {
  const { data }: { data: VkResult<VkUser[]> } = await axios({
    url: `${BASE_URL}/users.get`,
    adapter: jsonpAdapter,
    method: "GET",
    params: {
      user_id: userId,
      fields: "photo_200,screen_name,counters,status,followers_count,sex,bdate",
      access_token: token,
      v: VERSION,
    },
  });
  if (isError(data)) {
    throw new Error(data.error.error_msg);
  }
  if (data.response.length === 0) {
    throw new Error("User not found");
  }
  return data.response!![0];
}

export async function getFriendsCount(
  userId: number,
  token: string
): Promise<number> {
  const { data }: { data: VkResult<VkUser[]> } = await axios({
    url: `${BASE_URL}/users.get`,
    adapter: jsonpAdapter,
    method: "GET",
    params: {
      user_id: userId,
      fields: "counters",
      access_token: token,
      v: VERSION,
    },
  });
  if (isError(data)) {
    throw new Error(data.error.error_msg);
  }
  if (data.response.length === 0) {
    throw new Error("User not found");
  }
  return data.response!![0].counters?.friends ?? 0;
}

export async function getWall(
  userId: number,
  page: number,
  token: string
): Promise<VkWallResponse> {
  const { data }: { data: VkResult<VkWallResponse> } = await axios({
    url: `${BASE_URL}/wall.get`,
    adapter: jsonpAdapter,
    method: "GET",
    params: {
      owner_id: userId,
      fields: "id,photo_50,first_name,last_name",
      count: ITEMS_PER_PAGE_WALL,
      offset: ITEMS_PER_PAGE_WALL * page,
      access_token: token,
      v: VERSION,
      extended: 1,
    },
  });
  if (isError(data)) {
    throw new Error(data.error.error_msg);
  }
  return data.response!!;
}
