import { UserRepository } from "../interface/user.repository";
import { User } from "../../domain/entity/user.entity";

export class blockunblockUserUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(id: string, blockStatus: boolean): Promise<User | null> {
    return await this.userRepository.updateUserBlockStatus(id, blockStatus);
  }
}
