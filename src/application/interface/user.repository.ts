import { User } from "../../domain/entity/user.entity";
import { userDTO, signinUserDTO, updateUserDTO} from "../dto/user.dto";

export interface UserRepository {
  signup(data: userDTO): Promise<User>;
  signin(data: signinUserDTO): Promise<User | null>;
  finduserByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string,data: updateUserDTO): Promise<User | null>;
  findall(): Promise<User[] | null>;
  delete(id: string): Promise<User | null>;
  search(searchTerm: { [key: string]: string }):Promise<User[] | null>
  updateUserBlockStatus(id:string,blockStatus:boolean):Promise<User | null>
}
