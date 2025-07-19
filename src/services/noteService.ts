import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from "../types/note";

const axiosInstance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesResponse {
  data: Note[];
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 10,
  search?: string,
  tag?: NoteTag,
  sortBy: string = "created"
): Promise<FetchNotesResponse> => {
  const params: Record<string, any> = { page, perPage, sortBy };

  if (search) params.search = search;
  if (tag) params.tag = tag;

  const response: AxiosResponse<FetchNotesResponse> = await axiosInstance.get(
    "/notes",
    {
      params,
    }
  );

  return response.data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.post(
    "/notes",
    note
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.delete(`/${id}`);
  return response.data;
};
