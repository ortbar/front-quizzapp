import { Answer } from "../Answer/answer.model";

export interface QuestionDTO {
  id?: number; // opcional al crear
  textoPregunta: string;
  answers: Answer[];
}