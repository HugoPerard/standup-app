export interface OfficeWorker {
  name: string;
  onMorning: boolean;
  onAfternoon: boolean;
  photoUrl: string;
}

export interface Presence {
  LUNDI?: OfficeWorker[];
  MARDI?: OfficeWorker[];
  MERCREDI?: OfficeWorker[];
  JEUDI?: OfficeWorker[];
  VENDREDI?: OfficeWorker[];
}
export interface Office {
  id?: string;
  name: string;
  presence?: Presence;
}
