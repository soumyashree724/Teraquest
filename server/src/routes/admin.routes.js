import express from 'express';
import {
  createDestination,
  updateDestination,
  deleteDestination,
  createHotel,
  updateHotel,
  deleteHotel,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  upsertTravelInfo,
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/rbac.middleware.js';

const router = express.Router();

// Guard all admin routes with authentication + ADMIN role check
router.use(authenticate, authorize(['ADMIN']));

// Overview stats
router.get('/stats', getAdminStats);

// User Management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Destination Management
router.post('/destinations', createDestination);

router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);

// Hotel Management
router.post('/hotels', createHotel);
router.put('/hotels/:id', updateHotel);
router.delete('/hotels/:id', deleteHotel);

// Attraction Management
router.post('/attractions', createAttraction);
router.put('/attractions/:id', updateAttraction);
router.delete('/attractions/:id', deleteAttraction);

// Travel Info Management
router.put('/travel-info/:destinationId', upsertTravelInfo);

export default router;
