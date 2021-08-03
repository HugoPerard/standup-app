export interface OfficeWorker {
  name: string;
  onMorning: boolean;
  onAfternoon: boolean;
}

export interface Presence {
  LUNDI: OfficeWorker[];
  MARDI: OfficeWorker[];
  MERCREDI: OfficeWorker[];
  JEUDI: OfficeWorker[];
  VENDREDI: OfficeWorker[];
}
export interface Office {
  id: string;
  name: string;
  presence: Presence;
}
