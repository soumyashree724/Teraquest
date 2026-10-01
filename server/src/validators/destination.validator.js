import { z } from 'zod';

export const destinationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  country: z.string().min(1, 'Country is required'),
  region: z.string().min(1, 'Region is required'),
  continent: z.string().default('Europe'),
  latitude: z.number({ required_error: 'Latitude is required' }),
  longitude: z.number({ required_error: 'Longitude is required' }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Image must be a valid URL'),
  tagline: z.string().optional(),
  rating: z.number().min(1).max(5).optional().default(4.8),
});

export const hotelSchema = z.object({
  destinationId: z.string().min(1, 'Destination ID is required'),
  name: z.string().min(1, 'Hotel name is required'),
  address: z.string().min(1, 'Address is required'),
  rating: z.number().min(1).max(5).default(4.5),
  priceRange: z.string().default('$$$'),
  pricePerNight: z.number().min(1).default(150),
  imageUrl: z.string().url('Image must be a valid URL'),
  amenities: z.string().default('WiFi, Breakfast, Pool, AC'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const attractionSchema = z.object({
  destinationId: z.string().min(1, 'Destination ID is required'),
  name: z.string().min(1, 'Attraction name is required'),
  category: z.string().default('Landmark'),
  description: z.string().min(5, 'Description is required'),
  imageUrl: z.string().url('Image must be a valid URL'),
  rating: z.number().min(1).max(5).default(4.8),
  bestTimeOfDay: z.string().default('Morning & Afternoon'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const travelInfoSchema = z.object({
  destinationId: z.string().min(1, 'Destination ID is required'),
  bestTimeToVisit: z.string().min(1, 'Best time to visit is required'),
  currency: z.string().min(1, 'Currency is required'),
  language: z.string().min(1, 'Language is required'),
  safetyNotes: z.string().min(1, 'Safety notes are required'),
  localTips: z.string().min(1, 'Local tips are required'),
  timeZone: z.string().default('UTC+0'),
  emergencyContact: z.string().default('112 / 911'),
});
