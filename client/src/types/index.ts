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
  id: String;
  text: String;
  userId: String;
  roomId: String;
  isRead: Boolean;
}

export interface room {
  id: String;
  name: String;
  messages: message[];
  userIds: String[];
  avatar: String;
}
