export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
}

export interface NoteCreate {
  title: string;
  content: string;
  tag: Tag;
}
export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
