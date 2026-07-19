export interface FormulaData {
  _id: string;
  topic: string;
  equation: string | string[];
  grade: number;
  url?: string;
  urlName?: string;
}

export interface AssignmentData {
  _id: string;
  topic: string;
  assignments: string[];
  grade: number;
  url?: string;
  urlName?: string;
}

export interface ProjectData {
  _id: string;
  topic: string;
  description: string;
  projectAuthor?: string;
  grade: number;
  url?: string;
  urlName?: string;
}