export interface Thank {
  id?: string;
  author: string;
  date: string;
  type: 'THANK' | 'TO_ADD';
}
