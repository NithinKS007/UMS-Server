import { UserRepository } from "../interface/user.repository";
import { updateUserDTO } from "../dto/user.dto";
import { User } from "../../domain/entity/user.entity";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(id: string,data: updateUserDTO): Promise<User | null> {
    return await this.userRepository.update(id,data);
  }
}
