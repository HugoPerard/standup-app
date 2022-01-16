export interface Goal {
  id?: string;
  description: string;
  people?: string[];
  date: string;
  isComplete: boolean;
}

export interface HabitGoal {
  id?: string;
  description: string;
  created?: string;
  dateLastReset?: string;
  numberOfReset?: number;
}
