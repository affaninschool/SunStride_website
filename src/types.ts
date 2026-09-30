export type PageTab = 
  | 'home'
  | 'research'
  | 'system'
  | 'lab'
  | 'impact'
  | 'team'
  | 'about'
  | 'docs'
  | 'contact';

export interface BusData {
  id: string;
  code?: string;
  routeNumber: string;
  name: string;
  origin: string;
  destination: string;
  rfidUid: string;
  occupancy: 'Low' | 'Moderate' | 'Full';
  nextArrivalMinutes: number;
  scheduledTime: string;
  speedKmh: number;
  status: 'En Route' | 'Approaching' | 'At Station' | 'Departed';
  stops?: string[];
}

export interface SystemComponent {
  id: string;
  name: string;
  category: 'energy' | 'rfid' | 'control' | 'interface' | 'storage';
  shortDesc: string;
  functionDesc: string;
  roleInSunstride: string;
  whyItMatters: string;
  specs: { [key: string]: string };
}

export interface ResearchArea {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  focusPoints: string[];
  currentPhase: string;
  keyQuestions: string[];
}

export interface MethodologyStage {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  details: string;
  deliverables: string[];
  status: 'Completed' | 'In Progress' | 'Continuous';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  contribution: string;
  areaOfFocus: string;
  bio: string;
  toolsUsed: string[];
}

export interface LabConnectionNode {
  id: string;
  label: string;
  type: 'source' | 'storage' | 'controller' | 'sensor' | 'output' | 'vehicle';
  category: 'energy' | 'data' | 'system';
  x: number;
  y: number;
  connectedTo: string[];
}
