const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema(
  {
    displayName: {
      type: String,
      required: [true, 'Debe ingresar un nombre'],
      unique: true,
      minlength: [3, 'Nombre demasiado corto: mínimo 3 caracteres'],
      maxlength: [20, 'Nombre demasiado largo. máximo 20 caracteres'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: isEmail,
        message: 'El email ingresado no es válido',
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['1', '2', '3', '4'],
        message: 'El valor de estado de usuario debe ser 1, 2 o 3',
      },
      default: '1',
    },
    refreshToken: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
      },
    },
  }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (passToCompare) {
  const isMatch = await bcrypt.compare(passToCompare, this.password);
  return isMatch;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
