import prisma from '../prismaClient.js';
import {
  destinationSchema,
  hotelSchema,
  attractionSchema,
  travelInfoSchema,
} from '../validators/destination.validator.js';

// ================= Destinations CRUD =================
export const createDestination = async (req, res, next) => {
  try {
    const validated = destinationSchema.parse(req.body);
    const { travelInfo, ...destData } = req.body;

    const destination = await prisma.destination.create({
      data: {
        ...validated,
        travelInfo: travelInfo
          ? {
              create: {
                bestTimeToVisit: travelInfo.bestTimeToVisit || 'All year round',
                currency: travelInfo.currency || 'Local Currency',
                language: travelInfo.language || 'English / Official Language',
                safetyNotes: travelInfo.safetyNotes || 'Standard travel precautions apply.',
                localTips: travelInfo.localTips || 'Carry local cash and respectful attire.',
                timeZone: travelInfo.timeZone || 'UTC+0',
                emergencyContact: travelInfo.emergencyContact || '112 / 911',
              },
            }
          : undefined,
      },
      include: { travelInfo: true },
    });

    return res.status(201).json({
      success: true,
      message: 'Destination created successfully!',
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = destinationSchema.partial().parse(req.body);

    const updated = await prisma.destination.update({
      where: { id },
      data: validated,
      include: { travelInfo: true, hotels: true, attractions: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Destination updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Destination and all associated hotels/attractions deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ================= Hotels CRUD =================
export const createHotel = async (req, res, next) => {
  try {
    const validated = hotelSchema.parse(req.body);

    const hotel = await prisma.hotel.create({
      data: validated,
    });

    return res.status(201).json({
      success: true,
      message: 'Hotel created successfully!',
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = hotelSchema.partial().parse(req.body);

    const hotel = await prisma.hotel.update({
      where: { id },
      data: validated,
    });

    return res.status(200).json({
      success: true,
      message: 'Hotel updated successfully!',
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.hotel.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ================= Attractions CRUD =================
export const createAttraction = async (req, res, next) => {
  try {
    const validated = attractionSchema.parse(req.body);

    const attraction = await prisma.attraction.create({
      data: validated,
    });

    return res.status(201).json({
      success: true,
      message: 'Attraction created successfully!',
      data: attraction,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAttraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = attractionSchema.partial().parse(req.body);

    const attraction = await prisma.attraction.update({
      where: { id },
      data: validated,
    });

    return res.status(200).json({
      success: true,
      message: 'Attraction updated successfully!',
      data: attraction,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAttraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.attraction.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Attraction deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// ================= Travel Info Update =================
export const upsertTravelInfo = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const { bestTimeToVisit, currency, language, safetyNotes, localTips, timeZone, emergencyContact } = req.body;

    const travelInfo = await prisma.travelInfo.upsert({
      where: { destinationId },
      update: {
        bestTimeToVisit,
        currency,
        language,
        safetyNotes,
        localTips,
        timeZone,
        emergencyContact,
      },
      create: {
        destinationId,
        bestTimeToVisit,
        currency,
        language,
        safetyNotes,
        localTips,
        timeZone,
        emergencyContact,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Travel info updated successfully!',
      data: travelInfo,
    });
  } catch (error) {
    next(error);
  }
};

// ================= Stats Overview =================
export const getAdminStats = async (req, res, next) => {
  try {
    const [destinationsCount, hotelsCount, attractionsCount, usersCount] = await Promise.all([
      prisma.destination.count(),
      prisma.hotel.count(),
      prisma.attraction.count(),
      prisma.user.count(),
    ]);

    const recentDestinations = await prisma.destination.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { hotels: true, attractions: true } },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          destinations: destinationsCount,
          hotels: hotelsCount,
          attractions: attractionsCount,
          users: usersCount,
        },
        recentDestinations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= User Management =================
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { searchHistory: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be USER or ADMIN.' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully!`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

