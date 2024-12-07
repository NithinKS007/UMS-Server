import { User } from "../../domain/entity/user.entity";
import { createUserDTO, signinUserDTO } from "../dto/user.dto";

export interface UserRepository {
  signup(data: createUserDTO): Promise<User>;
  signin(data: signinUserDTO): Promise<User | null>;
  finduserByEmail(email: string): Promise<User | null>;
}
