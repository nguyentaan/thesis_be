const express = require('express');
const router = express.Router();
const {writeReview, getProductReviews} = require('../controllers/product/reviewController');

router.post('/write', writeReview);
router.get('/:productId', getProductReviews);

module.exports = router;