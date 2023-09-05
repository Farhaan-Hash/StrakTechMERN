import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {timestamps: true}
);

// Validate Password--------------------------------------------------------------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// While registering password of a new user  and hashing it before saving it to DB----------------------------------------------
userSchema.pre("save", async function (next) {
  // if we are not modifying the password
  //pre and post methods resembles before & after saving to the database
  if (!this.isModified("password")) {
    next();
  }
  // if we are  modifying the password

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model("User", userSchema);

export default User;
