import { UserAnswer } from "./userAnswer.model";

export interface Game{

  id?: number; // opcional si aún no se ha creado
  gameName?: string;
  score: number;
  createdAt: string; // LocalDateTime → string ISO en JSON
  userId?: number;
  username?: string;
  answers: UserAnswer[];





}