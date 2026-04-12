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
