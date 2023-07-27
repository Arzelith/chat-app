const mongoose = require('mongoose');

const FavoriteSchema = mongoose.Schema(
  {
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Favorite = mongoose.model('Favorite', FavoriteSchema);
module.exports = Favorite;
