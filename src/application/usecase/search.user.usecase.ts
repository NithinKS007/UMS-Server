import { User } from "../../domain/entity/user.entity";
import { MongoUserRepository } from "../../infrastructure/repository/mongo.user.repository";

export class SearchuserUseCase {
  constructor(private userRepository: MongoUserRepository) {}
  async execute(searchTerm:  { [key: string]: string }): Promise<User[] | null> {
    return await this.userRepository.search(searchTerm);
  }
}
