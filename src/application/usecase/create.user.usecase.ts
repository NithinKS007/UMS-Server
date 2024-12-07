import { UserRepository } from "../interface/user.repository";
import { User } from "../../domain/entity/user.entity";
import { createUserDTO } from "../dto/user.dto";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(data: createUserDTO): Promise<User> {
    return await this.userRepository.signup(data);
  }
}
