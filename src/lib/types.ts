export interface User {
  id: number;
  icon: string;
  name: string;
  firstName: string;
  username: string;
  description?: string;
  description2?: string;
  friendOf?: number[];
}

// to render users in virtual list
export interface VirtualUser {
  id: number;
  value: User;
  selected?: boolean;
}

export interface Friend {
  id: number;
  name: string;
  icon: string;
}

export interface PhotoItem {
  width: number;
  height: number;
  url: string;
}

export interface WallPost {
  id: number;
  posterName: string;
  posterIcon: string;
  date: string;
  text: string;
  photos: PhotoItem[];
  nestedItems: WallPost[];
}

// to render posts in virtual list
export interface VirtualWallPost {
  id: number;
  value: WallPost;
}
