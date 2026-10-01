import express from 'express';
import {
  getDestinations,
  getDestinationById,
  getHotelsByDestination,
  getAttractionsByDestination,
  getTravelInfoByDestination,
  getNearbyDestinations,
  getSearchHistory,
} from '../controllers/destination.controller.js';
import { optionalAuth, authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', optionalAuth, getDestinations);
router.get('/history/my-searches', authenticate, getSearchHistory);
router.get('/:id', optionalAuth, getDestinationById);
router.get('/:id/hotels', getHotelsByDestination);
router.get('/:id/attractions', getAttractionsByDestination);
router.get('/:id/travel-info', getTravelInfoByDestination);
router.get('/:id/nearby-destinations', getNearbyDestinations);

export default router;
