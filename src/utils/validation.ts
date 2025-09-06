import { DraftLog } from '../types/index';

export type ValidationErrors = Record<string, string>;

export const validateServiceLog = (
  formData: Omit<DraftLog, 'id' | 'lastSaved'>
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.providerId.trim()) errors.providerId = 'Provider ID is required';
  if (!formData.serviceOrder.trim()) errors.serviceOrder = 'Service Order is required';
  if (!formData.carId.trim()) errors.carId = 'Car ID is required';
  if (formData.odometer <= 0) errors.odometer = 'Odometer must be greater than 0';
  if (formData.engineHours < 0) errors.engineHours = 'Engine hours cannot be negative';
  if (!formData.startDate) errors.startDate = 'Start date is required';
  if (!formData.endDate) errors.endDate = 'End date is required';
  if (new Date(formData.endDate) < new Date(formData.startDate)) {
    errors.endDate = 'End date cannot be before start date';
  }
  if (!formData.serviceDescription.trim()) errors.serviceDescription = 'Description is required';

  return errors;
};
