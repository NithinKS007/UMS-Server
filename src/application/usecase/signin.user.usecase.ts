import { User } from "../../domain/entity/user.entity";
import { signinUserDTO } from "../dto/user.dto";
import { UserRepository } from "../interface/user.repository";

export class SigninUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(data: signinUserDTO): Promise<User | null> {
    return await this.userRepository.signin(data);
  }
}
