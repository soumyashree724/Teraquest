import prisma from '../prismaClient.js';
import { calculateDistanceKm } from '../utils/geo.js';

export const getDestinations = async (req, res, next) => {
  try {
    const { query, continent, region } = req.query;

    const where = {};

    if (continent && continent !== 'All') {
      where.continent = { equals: continent };
    }

    if (region && region !== 'All') {
      where.region = { contains: region, mode: 'insensitive' };
    }

    if (query && query.trim() !== '') {
      const q = query.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { country: { contains: q, mode: 'insensitive' } },
        { region: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }


    const destinations = await prisma.destination.findMany({
      where,
      include: {
        travelInfo: true,
        _count: {
          select: { hotels: true, attractions: true },
        },
      },
      orderBy: { rating: 'desc' },
    });

    return res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

export const getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        hotels: {
          orderBy: { rating: 'desc' },
        },
        attractions: {
          orderBy: { rating: 'desc' },
        },
        travelInfo: true,
      },
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found.',
      });
    }

    // If user is logged in, optionally save search history
    if (req.user) {
      try {
        await prisma.searchHistory.create({
          data: {
            userId: req.user.id,
            destinationId: destination.id,
          },
        });
      } catch (e) {
        // Non-critical, ignore failure
      }
    }

    return res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelsByDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotels = await prisma.hotel.findMany({
      where: { destinationId: id },
      orderBy: { rating: 'desc' },
    });

    return res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

export const getAttractionsByDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attractions = await prisma.attraction.findMany({
      where: { destinationId: id },
      orderBy: { rating: 'desc' },
    });

    return res.status(200).json({
      success: true,
      count: attractions.length,
      data: attractions,
    });
  } catch (error) {
    next(error);
  }
};

export const getTravelInfoByDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const travelInfo = await prisma.travelInfo.findUnique({
      where: { destinationId: id },
    });

    if (!travelInfo) {
      return res.status(404).json({
        success: false,
        message: 'Travel info not found for this destination.',
      });
    }

    return res.status(200).json({
      success: true,
      data: travelInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const getNearbyDestinations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const current = await prisma.destination.findUnique({ where: { id } });

    if (!current) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }

    const allOtherDestinations = await prisma.destination.findMany({
      where: { id: { not: id } },
      select: {
        id: true,
        name: true,
        country: true,
        region: true,
        latitude: true,
        longitude: true,
        imageUrl: true,
        rating: true,
      },
    });

    const withDistances = allOtherDestinations.map((dest) => {
      const distanceKm = calculateDistanceKm(
        current.latitude,
        current.longitude,
        dest.latitude,
        dest.longitude
      );
      return {
        ...dest,
        distanceKm,
      };
    });

    withDistances.sort((a, b) => a.distanceKm - b.distanceKm);

    return res.status(200).json({
      success: true,
      data: withDistances.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

export const getSearchHistory = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const history = await prisma.searchHistory.findMany({
      where: { userId: req.user.id },
      include: {
        destination: true,
      },
      orderBy: { searchedAt: 'desc' },
      take: 10,
    });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
