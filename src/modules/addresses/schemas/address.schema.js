import mongoose from "mongoose";
const { Schema } = mongoose;

const ADDRESS_MODEL = "addresses";

const addressSchema = new Schema(
  {
    // fullName: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   minLength: 2,
    //   maxLength: 50
    // },
    // phoneNumber: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    provinceCode: {
      type: String,
      required: true,
    },
    districtCode: {
      type: String,
      required: true,
    },
    wardCode: {
      type: String,
      required: true,
    },
    provinceName: {
      type: String,
      required: true
    },
    districtName: {
      type: String,
      required: true
    },
    wardName: {
      type: String,
      required: true
    },
    fullAddress: {
      type: String,
      length: 300,
      trim: true,
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false,
    },

    // Foreign Key
    customer_id: { 
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
  },
  {
    versionKey: false,
    timestamps: true,
    _id: true,
    id: false,
    collection: ADDRESS_MODEL,
  }
);

const AddressModel = mongoose.model("Address", addressSchema);
export { AddressModel };
