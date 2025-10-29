const { default: mongoose, model } = require("mongoose");

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps }
);

const WalletModel = model("wallet", WalletSchema);

module.exports = WalletModel;
