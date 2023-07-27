const express = require('express');
const {
  addFavorite,
  getAllFavorites,
  deleteFavorite,
} = require('../controllers/favorite-controller');
const auth = require('../middlewares/auth-handler');
const router = express.Router();

router
  .route('/')
  .post(auth, addFavorite)
  .get(auth, getAllFavorites)
router.route('/:favorite').delete(auth, deleteFavorite)

module.exports = router;
