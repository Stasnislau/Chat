export interface alertInterface {
  type: "success" | "error";
  text: string;
  id: number;
}
export interface fileObject extends File {
  preview: string;
}

export interface user {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  roomIds: string[];
}
export interface message {
  id: string;
  text: string;
  userId: String;
  roomId: String;
  dateSent: Date;
  isRead: boolean;
  audioUrl?: string;
  user?: {
    name: string;
  };
}

export interface room {
  id: string;
  name: string;
  messages: message[];
  userIds: string[];
  avatar: string;
  numberOfUnreadMessages?: number;
  isOnline?: boolean;
}

export interface extendedRoom extends room {
  messages: message[];
}

