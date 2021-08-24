export interface Thank {
  id?: string;
  author: string;
  timestamp: number;
  photoURL: string;
  type: 'THANK' | 'TO_ADD';
}
