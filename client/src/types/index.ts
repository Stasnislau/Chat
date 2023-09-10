export interface alertInterface {
  type: "success" | "error";
  text: string;
  id: number;
}
export interface fileObject extends File {
  preview: string;
}
