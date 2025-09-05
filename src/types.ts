export type ServiceType = 'planned' | 'unplanned' | 'emergency';

export interface ServiceLog {
  id: string;
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number | null;
  engineHours: number | null;
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
  createdAt: string;
}

export interface Draft extends Omit<ServiceLog, 'id' | 'createdAt'> {
  draftId: string;
  isSaved?: boolean;
}
