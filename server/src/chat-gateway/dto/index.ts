export interface messageDTO {
    text: string;
    user: string;
    date: Date;
    audio?: Blob;
    roomId: string;
    userId: string;
}
