export interface ServerMessage {
  title: string;
  description: string;
  date: Date;
  userId: string;
  id?: string;
  type?: string;
  retry?: number;
}
