export interface Thank {
  id?: string;
  author: string;
  timestamp: number;
  type: 'THANK' | 'TO_ADD';
}
