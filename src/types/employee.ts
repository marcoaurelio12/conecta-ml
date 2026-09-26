
export interface EmployeeType {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  imageUrl: string;
  managerId: string | null;
  bio?: string;
}
