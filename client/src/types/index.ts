export interface alertInterface {
  type: "success" | "error";
  text: string;
  id: number;
}
export interface fileObject extends File {
  preview: string;
}

export interface user{
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  roomIds: string[];
 
}