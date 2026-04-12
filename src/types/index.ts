export interface Civility {
  id: number;
  description: string; // max 15 chars
}

export interface User {
  id: number;
  lastName: string;     // max 30
  firstName: string;    // max 30
  address: string;      // max 35
  zip: string;          // max 5
  city: string;         // max 30
  amount: number;
  phone: string;        // max 20
  fax: string;          // max 20
  email: string;        // max 50
  memberNumber: number; // max 2 digits
  laoLastName: string;  // max 50
  civilityId: number;   // FK → Civility
}

export interface Activity {
  id: number;
  description: string; // max 50
  startDate: string;   // ISO date string
  endDate: string;     // ISO date string
  estimation: number;
  total: number;
  expense: number;
  checkTotal: number;
  cashTotal: number;
}

export interface PaymentMethod {
  id: number;
  description: string; // max 15
}

export interface Transaction {
  id: number;
  activityId: number;  // FK → Activity
  userId: number;      // FK → User
  date: string;        // ISO date string
  amount: number;
  paymentMethod: number; // FK → PaymentMethod
  notes: string;       // max 50
  checkNumber: number; // max 4 digits
  bankName: string;    // max 20
  bankCity: string;    // max 20
}

export interface DonationFilters {
  userId?: number;
  activityId?: number;
  paymentMethodId?: number;
  dateFrom?: string;
  dateTo?: string;
}
