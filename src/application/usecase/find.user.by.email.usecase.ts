import { UserRepository } from "../interface/user.repository";
import { User } from "../../domain/entity/user.entity";

export class FindUserByEmailUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(email:string): Promise<User|null> {
    return await this.userRepository.finduserByEmail(email);
  }
}
