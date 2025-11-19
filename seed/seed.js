const { anonymousDonor } = require("../constants/anonymousUser");
const UserModel = require("../models/userModel");

async function seedAnonymousUser() {
  try {
    const { _id, ...userData } = anonymousDonor;

    const existingUser = await UserModel.findById(_id);

    if (!existingUser) {
      await UserModel.create({ _id, ...userData });
      console.log("✅ Anonymous Donor user record created successfully.");
    } else {
      console.log("ℹ️ Anonymous Donor user record already exists.");
    }
  } catch (error) {
    console.error("❌ Error seeding Anonymous Donor user:", error);
  }
}

module.exports = seedAnonymousUser;
