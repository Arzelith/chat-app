const Favorite = require('../models/favorite-model');
const { asyncHandler } = require('../utils/async-handler');
const ApiError = require('../errors/api-error');

const addFavorite = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const id = req.user._id;
  if (!userId) {
    throw new ApiError(400, 'Id de usuario no encontrada');
  }
  const exists = await Favorite.findOne({ addedBy: id, user: userId });
  if (exists) {
    throw new ApiError(409, 'Favorito ya existe');
  }
  await Favorite.create({ addedBy: id, user: userId });
  const favorite = await Favorite.findOne({ addedBy: id, user: userId }).populate(
    'user',
    'displayName email avatar'
  );
  res.status(201).json({ favorite });
});

const getAllFavorites = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const favorites = await Favorite.find({ addedBy: id }).populate(
    'user',
    '_id displayName email avatar'
  );
  res.status(200).json({ favorites });
});

const deleteFavorite = asyncHandler(async (req, res) => {
  const userId = req.params.favorite;
  const id = req.user._id;
  if (!userId) {
    throw new ApiError(400, 'Id de usuario no encontrada');
  }
  const favorite = await Favorite.findOneAndDelete({ addedBy: id, user: userId });
  res.status(200).json({ _id: userId });
});

module.exports = { addFavorite, getAllFavorites, deleteFavorite };
