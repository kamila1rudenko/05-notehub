import axios from "axios";
import type { Note, NoteCreate } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

interface FetchNotesResponse {
  results: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search: string,
  page: number
): Promise<FetchNotesResponse> => {
  const { data } = await instance.get("/notes", {
    params: {
      search,
      page,
      perPage: 6,
      sortBy: "created",
    },
  });

  return {
    results: data.data,
    totalPages: data.totalPages,
  };
};

export const createNote = async (body: NoteCreate): Promise<Note> => {
  const { data } = await instance.post("/notes", body);
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await instance.delete(`/notes/${id}`);
};
