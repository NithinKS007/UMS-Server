import { UserRole } from "../../domain/entity/user.entity";

export interface createUserDTO {
  fname: string;
  lname: string;
  email: string;
  phone: number;
  password: string;
  role: UserRole;
  dateOfBirth?: Date;
  address?: string;
}

export interface signinUserDTO {
  email: string;
  password: string;
}
