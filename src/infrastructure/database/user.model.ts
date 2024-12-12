import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../../domain/entity/user.entity";

export interface UserDocument extends Document {
  fname: string;
  lname: string;
  email: string;
  phone: number;
  password: string;
  isBlocked: boolean;
  role: UserRole;
  dateOfBirth?: Date;
  address?: string;
}

const UserSchema: Schema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    dateOfBirth: { type: Date },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<UserDocument>("User", UserSchema);
