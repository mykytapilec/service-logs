import { ServiceType } from '../types';

interface ServiceLogFormData {
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: number;
  engineHours: number;
  startDate: string;
  endDate: string;
  type: ServiceType;
  serviceDescription: string;
}

export const validateServiceLogForm = (
  formData: ServiceLogFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.providerId.trim()) {
    errors.providerId = 'Provider ID is required';
  }

  if (!formData.serviceOrder.trim()) {
    errors.serviceOrder = 'Service Order is required';
  }

  if (!formData.carId.trim()) {
    errors.carId = 'Car ID is required';
  }

  if (formData.odometer <= 0) {
    errors.odometer = 'Odometer must be greater than 0';
  }

  if (formData.engineHours <= 0) {
    errors.engineHours = 'Engine hours must be greater than 0';
  }

  if (!formData.startDate) {
    errors.startDate = 'Start Date is required';
  }

  if (!formData.endDate) {
    errors.endDate = 'End Date is required';
  }

  if (new Date(formData.endDate) < new Date(formData.startDate)) {
    errors.endDate = 'End Date cannot be earlier than Start Date';
  }

  if (!formData.serviceDescription.trim()) {
    errors.serviceDescription = 'Description is required';
  }

  return errors;
};
