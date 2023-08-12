const express = require('express');
const portfolioController = require('./../controllers/portfolioController')
const authController = require('./../controllers/authController');
const router = express.Router();

router
    .route('/')
    .get(authController.protect,portfolioController.getAllPortfolios)
    .post(portfolioController.createPortfolio);

router
    .route('/:id')
    .get(portfolioController.getPortfolio)
    .patch(portfolioController.updatePortfolio)
    .delete(portfolioController.deletePortfolio);

module.exports = router;