import mongoose from "mongoose";
import { GENDER } from "#src/constants";
const { Schema, Types } = mongoose;

const USER_MODEL = "users";

const userSchema = new Schema(
  {
    avatar: {
      type: String,
      // every define required
      required: false,
      length: 300,
    },
    name: {
      type: String,
      required: true,
      length: 100,
      index: true,
    },
    phone: {
      type: String,
      required: false,
      length: 15,
    },
    birthday: {
      type: Date,
      required: false,
      default: null,
    },
    gender: {
      type: String,
      required: false,
      enum: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    _id: true,
    id: false,
    // note clearly name of collection, database model
    collection: USER_MODEL,
  },
);

// define UserModel not User (to clearly responsibility of MODEL)
const UserModel = mongoose.model("User", userSchema);
export { UserModel };
