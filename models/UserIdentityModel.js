import { model, Schema } from "mongoose";

const UserIdentitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ["local", "google", "facebook", "github"],
      default: "local",
    },
    providerId: {
      type: String,
      required: () => this.provider !== "local",
    },
    accessToken: String,
    refreshToken: String,
  },
  { timestamps: true }
);

UserIdentitySchema.index({ provider: 1, providerId: 1 }, { unique: true });

const UserIdentityModel = model("UserIdentity", UserIdentitySchema);
module.exports = UserIdentityModel;
