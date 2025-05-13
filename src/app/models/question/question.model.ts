import { Answer } from "../Answer/answer.model";

export interface Question {
    id: number;
    textoPregunta: string;
    answers: Answer[];
  }