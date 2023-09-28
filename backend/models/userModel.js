import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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
  { timestamps: true }
)

// this takes the plain text password that the user enters and compares it to the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  // this.password is the password in the database
  // enteredPassword is the password that the user entered
  return await bcrypt.compare(enteredPassword, this.password)
}

// pre allows you to run a function before saving to the database
// this function hashes the password before saving it to the database when the user is modifying (or creating) the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
