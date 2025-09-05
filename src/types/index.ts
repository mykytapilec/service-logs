export type ServiceType = 'planned' | 'unplanned' | 'emergency';

export interface DraftLog {
  id: string;
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number;
  engineHours: number;
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
  lastSaved?: string;
}

export interface ServiceLog {
  id: string;
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number;
  engineHours: number;
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
  createdAt: string;
}
