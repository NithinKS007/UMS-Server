import {
  userDTO,
  signinUserDTO,
  updateUserDTO,
} from "../../application/dto/user.dto";
import { UserRepository } from "../../application/interface/user.repository";
import { User } from "../../domain/entity/user.entity";
import { comparePassword } from "../../shared/utils/hash.password";
import userModel from "../database/user.model";

export class MongoUserRepository implements UserRepository {
  async signup(data: userDTO): Promise<User> {
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
  async signin(data: signinUserDTO): Promise<User | null> {
    const { email, password } = data;
    const user = await userModel.findOne({ email: email });

    if (!user) {
      console.log("User not found for email:", email);
      return null;
    }
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      console.log("Invalid password for user:", data.email);
      return null;
    }
    return user;
  }
  async finduserByEmail(email: string): Promise<User | null> {
    return await userModel.findOne({ email: email }).select("-password");
  }

  async findById(id: string): Promise<User | null> {
    return await userModel.findById(id);
  }

  async update(data: updateUserDTO, id: string): Promise<User | null> {
    const updatedData = await userModel
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .select("-password");
    return updatedData;
  }
  async findall(): Promise<User[] | null> {
    const usersData = await userModel.find().sort({ createdAt: -1 });
    return usersData;
  }
  async delete(id: string): Promise<User | null> {
    const deletedUser = await userModel.findByIdAndDelete(id);
    return deletedUser;
  }
  async search(searchTerm: { [key: string]: string }): Promise<User[] | null> {
    const { search, sort, filter, direction } = searchTerm;
    
    let query: any = {};

    if (search) {
      query.$or = [
        { fname: { $regex: search, $options: "i" } },
        { lname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (filter === "Block") {
      query.isBlocked = true;
    } else if (filter === "Unblock") {
      query.isBlocked = false;
    } else if (filter === "All" || !filter) {
    }

    let sortOption = {};

    if (sort === "First Name" && direction === "A to Z") {
      sortOption = { fname: 1 };
    } else if (sort === "First Name" && direction === "Z to A") {
      sortOption = { fname: -1 };
    } else if (sort === "Last Name" && direction === "A to Z") {
      sortOption = { lname: 1 };
    } else if (sort === "Last Name" && direction === "Z to A") {
      sortOption = { lname: -1 };
    } else if (sort === "Email" && direction === "A to Z") {
      sortOption = { email: 1 };
    } else if (sort === "Email" && direction === "Z to A") {
      sortOption = { email: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const usersData = await userModel
      .find({
        role: { $ne: "admin" },
        ...query,
      })
      .select("-password")
      .sort(sortOption);

      console.log("user data",usersData);
      
    return usersData;
  }
}
