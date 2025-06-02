import { Question } from './question.model';

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // página actual (empieza en 0)
  size: number;
  first: boolean;
  last: boolean;
}