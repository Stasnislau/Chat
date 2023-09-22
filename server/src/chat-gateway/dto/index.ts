export interface messageDTO {
    text: string;
    user: string;
    date: Date;
    audioBlob?: Blob;
    roomId: string;
    userId: string;
}
