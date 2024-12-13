import { UserRole } from "../../domain/entity/user.entity";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface userDTO {
  fname: string;
  lname: string;
  email: string;
  phone: number;
  password: string;
  role?: UserRole;
  dateOfBirth?: Date;
  address?: string;
}

export type signinUserDTO = Pick<userDTO, "email" | "password">;

export interface updateUserDTO extends Partial<userDTO> {}

export interface UserPayLoadDTO extends JwtPayload {
  id: string;
  role: UserRole;
}
// export interface searchTermDTO {
//   searchText: string;
// }

export interface IuserAuthInfoRequest extends Request {
  user?: UserPayLoadDTO;
}
