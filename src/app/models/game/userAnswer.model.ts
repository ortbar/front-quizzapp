export interface UserAnswer {
  id?: number; // opcional, si aún no se ha guardado
  gameId: number;
  questionId: number;
  selectedAnswerId: number | null;
}