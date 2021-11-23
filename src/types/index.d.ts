type UserData = {
  fullName: string;
  hospitalName: string;
  specialization: string;
  isDoctor: boolean;
};

type Prescription = { note: string; timestamp: number; createdBy: string };

type Patient = {
  fullName?: string;
  sex?: string;
  age?: number;
  address: string;
  status?: 'none' | 'requested' | 'approved';
  requestedDoctors?: string[];
  allowedDoctors?: string[];
  prescriptionNotes?: Prescription[];
};
