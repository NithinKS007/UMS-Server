import { createUserDTO, signinUserDTO } from "../../application/dto/user.dto";
import { UserRepository } from "../../application/interface/user.repository";
import { User } from "../../domain/entity/user.entity";
import { comparePassword } from "../../shared/utils/hash.password";
import userModel from "../database/user.model";

export class MongoUserRepository implements UserRepository {
  async signup(data: createUserDTO): Promise<User> {
    const { fname, lname, email, phone, password, dateOfBirth, address, role } =
      data;

    const user = new userModel({
      fname,
      lname,
      email,
      phone,
      password,
      role,
      dateOfBirth,
      address,
    });

    return await user.save();
  }
  async finduserByEmail(email: string): Promise<User | null> {
    return await userModel.findOne({ email: email });
  }

  async signin(data: signinUserDTO): Promise<User | null> {

     const {email,password} = data
    const user = await userModel.findOne({ email:email});
    
    if (!user) {
      console.log("User not found for email:",email);
      return null;
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      console.log("Invalid password for user:", data.email);
      return null;
    }

    return user;
  }
}
