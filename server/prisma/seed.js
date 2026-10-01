import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing existing database records...');
  await prisma.searchHistory.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.travelInfo.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Seeding default users...');
  const salt = await bcrypt.genSalt(10);
  const userPassword = await bcrypt.hash('Traveler123!', salt);
  const adminPassword = await bcrypt.hash('Admin123!', salt);

  const regularUser = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'user@travel.com',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'Alexander Wright (Admin)',
      email: 'admin@travel.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('🌍 Seeding curated destinations, hotels, attractions, and travel info...');

  const destinationsData = [
    {
      name: 'Kyoto',
      country: 'Japan',
      region: 'Kansai',
      continent: 'Asia',
      latitude: 35.0116,
      longitude: 135.7681,
      tagline: 'Timeless Temples, Bamboo Groves & Geisha Heritage',
      description: 'Kyoto, once the capital of Japan, is a city on the island of Honshu famous for its classical Buddhist temples, gardens, imperial palaces, traditional wooden houses, and cherry blossom avenues.',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
      rating: 4.9,
      travelInfo: {
        bestTimeToVisit: 'March to May (Cherry Blossoms) and October to November (Vibrant Autumn Foliage)',
        currency: 'Japanese Yen (JPY / ¥)',
        language: 'Japanese (English signage common in train stations & tourist centers)',
        safetyNotes: 'Exceptionally safe day and night. Low crime rate. Respect temple etiquette (remove shoes where requested).',
        localTips: 'Purchase an IC card (ICOCA/Suica) for seamless bus and train travel. Visit Fushimi Inari at sunrise to avoid peak crowds.',
        timeZone: 'UTC+9 (JST)',
        emergencyContact: '110 (Police), 119 (Ambulance/Fire)',
      },
      hotels: [
        {
          name: 'The Ritz-Carlton Kyoto',
          address: 'Kamogawa Nijo-Ohashi Hotori, Nakagyo-ku, Kyoto',
          rating: 4.9,
          priceRange: '$$$$',
          pricePerNight: 750,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          amenities: 'River View, Zen Garden, Spa, Michelin Dining, Free WiFi, Onsen Tub',
          latitude: 35.0125,
          longitude: 135.7725,
        },
        {
          name: 'Hoshinoya Kyoto',
          address: '11-2 Arashiyama Genrokuzan-cho, Nishikyo-ku, Kyoto',
          rating: 4.8,
          priceRange: '$$$$',
          pricePerNight: 620,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          amenities: 'Boat Transfer, Traditional Kaiseki, River Pavilion, Tea Ceremony, AC',
          latitude: 35.0142,
          longitude: 135.6710,
        },
        {
          name: 'Hotel Kanra Kyoto',
          address: '190 Kitamachi, Karasuma-dori Rokujo-sagaru, Shimogyo-ku, Kyoto',
          rating: 4.7,
          priceRange: '$$$',
          pricePerNight: 280,
          imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          amenities: 'Tatami Rooms, Modern Cedar Tubs, Italian-Japanese Fusion, High Speed WiFi',
          latitude: 34.9920,
          longitude: 135.7592,
        },
      ],
      attractions: [
        {
          name: 'Fushimi Inari-Taisha',
          category: 'Shinto Shrine',
          description: 'Famous for its thousands of vermilion torii gates straddling hiking trails up sacred Mount Inari.',
          imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Early Morning (6:00 AM - 8:30 AM)',
          latitude: 34.9671,
          longitude: 135.7727,
        },
        {
          name: 'Kinkaku-ji (The Golden Pavilion)',
          category: 'Historic Temple',
          description: 'Zen Buddhist temple whose top two floors are completely covered in dazzling gold leaf, reflected across the mirror pond.',
          imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          bestTimeOfDay: 'Mid-Morning (9:00 AM)',
          latitude: 35.0394,
          longitude: 135.7292,
        },
        {
          name: 'Arashiyama Bamboo Grove',
          category: 'Nature & Landscape',
          description: 'Soaring emerald stalks of bamboo that rustle peacefully in the mountain breeze, adjacent to Tenryu-ji Temple.',
          imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
          rating: 4.7,
          bestTimeOfDay: 'Sunrise (7:00 AM)',
          latitude: 35.0170,
          longitude: 135.6713,
        },
      ],
    },
    {
      name: 'Santorini',
      country: 'Greece',
      region: 'Cyclades',
      continent: 'Europe',
      latitude: 36.3932,
      longitude: 25.4615,
      tagline: 'Whitewashed Cliffs, Cobalt Domes & Aegean Sunsets',
      description: 'One of the Cyclades islands in the Aegean Sea, devastated in the 16th century BC by a volcanic eruption that shaped its rugged caldera landscape, cliffside towns, and world-renowned sunset views.',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80',
      rating: 4.9,
      travelInfo: {
        bestTimeToVisit: 'May to October (warm swimming weather and clear sky sunsets; June/Sept have best balance of vibe & weather)',
        currency: 'Euro (EUR / €)',
        language: 'Greek (English is universally spoken in hospitality)',
        safetyNotes: 'Extremely safe island. Take care when walking on cobblestone stairs in cliffside villages; wear comfortable footwear.',
        localTips: 'Book sunset dinner reservations in Oia weeks in advance. Rent an ATV or small car to explore Akrotiri and Red Beach easily.',
        timeZone: 'UTC+2 (EET)',
        emergencyContact: '112 (European Emergency Number), 100 (Police)',
      },
      hotels: [
        {
          name: 'Canaves Oia Suites',
          address: 'Main Street, Oia 847 02, Santorini',
          rating: 4.9,
          priceRange: '$$$$',
          pricePerNight: 850,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          amenities: 'Infinity Caldera Pool, Champagne Breakfast, Private Balconies, Luxury Spa',
          latitude: 36.4618,
          longitude: 25.3753,
        },
        {
          name: 'Grace Hotel, Auberge Resorts',
          address: 'Imerovigli 847 00, Santorini',
          rating: 4.9,
          priceRange: '$$$$',
          pricePerNight: 920,
          imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
          amenities: 'Cliffside Infinity Pool, Varoulko Restaurant, Sunset Bar, Butler Service',
          latitude: 36.4332,
          longitude: 25.4215,
        },
        {
          name: 'Astro Palace Hotel & Suites',
          address: 'Fira 847 00, Santorini',
          rating: 4.6,
          priceRange: '$$$',
          pricePerNight: 260,
          imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
          amenities: 'Wellness Center, Outdoor & Indoor Pools, Free Airport Shuttle, Breakfast Included',
          latitude: 36.4167,
          longitude: 25.4333,
        },
      ],
      attractions: [
        {
          name: 'Oia Sunset Castle & Blue Domes',
          category: 'Iconic Viewpoint',
          description: 'The world-famous vantage point over the caldera where crowds gather to applaud the vibrant Mediterranean sunset.',
          imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Sunset (6:30 PM - 8:00 PM)',
          latitude: 36.4628,
          longitude: 25.3725,
        },
        {
          name: 'Red Beach (Kokkini Paralia)',
          category: 'Nature & Beach',
          description: 'Stunning volcanic beach bordered by towering rust-red cliffs and crystal-clear Aegean turquoise waters.',
          imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          rating: 4.6,
          bestTimeOfDay: 'Late Morning (10:00 AM)',
          latitude: 36.3486,
          longitude: 25.3942,
        },
        {
          name: 'Ancient Akrotiri Archaeological Site',
          category: 'Archaeological Ruins',
          description: 'Minoan Bronze Age settlement preserved beneath volcanic ash, providing a fascinating glimpse into prehistoric Europe.',
          imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          bestTimeOfDay: 'Afternoon (2:00 PM - 4:00 PM)',
          latitude: 36.3512,
          longitude: 25.4034,
        },
      ],
    },
    {
      name: 'Banff & Lake Louise',
      country: 'Canada',
      region: 'Alberta',
      continent: 'Americas',
      latitude: 51.1784,
      longitude: -115.5708,
      tagline: 'Glacial Turquoise Waters & Towering Rocky Mountain Peaks',
      description: "Banff National Park is Canada's oldest national park, encompassing 6,641 square kilometers of mountainous terrain, countless glaciers and ice fields, dense coniferous forest, and alpine landscapes.",
      imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1600&q=80',
      rating: 4.9,
      travelInfo: {
        bestTimeToVisit: 'June to August for hiking/canoeing; December to March for world-class skiing & snowboarding',
        currency: 'Canadian Dollar (CAD / $)',
        language: 'English, French',
        safetyNotes: 'Bear safety protocols are active in park boundaries. Carry bear spray on wilderness trails and maintain a safe distance from wildlife.',
        localTips: 'Book the Parks Canada shuttle early for Lake Louise and Moraine Lake to bypass parking limits. Watch for the Northern Lights in winter.',
        timeZone: 'UTC-7 (MST)',
        emergencyContact: '911 (Emergency), Banff Warden Dispatch: 403-762-1470',
      },
      hotels: [
        {
          name: 'Fairmont Banff Springs',
          address: '405 Spray Ave, Banff, AB T1L 1J4, Canada',
          rating: 4.8,
          priceRange: '$$$$',
          pricePerNight: 580,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          amenities: 'Castle Architecture, Mineral Springs Spa, Golf Course, Mountain Views, Ski Valet',
          latitude: 51.1648,
          longitude: -115.5617,
        },
        {
          name: 'Fairmont Chateau Lake Louise',
          address: '111 Lake Louise Dr, Lake Louise, AB T0L 1E0, Canada',
          rating: 4.9,
          priceRange: '$$$$',
          pricePerNight: 640,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          amenities: 'Lakeside Frontage, Canoe Rental, Guided Mountain Tours, Heated Pools, Fine Dining',
          latitude: 51.4177,
          longitude: -116.2168,
        },
        {
          name: 'Moose Hotel & Suites',
          address: '345 Banff Ave, Banff, AB T1L 1H8, Canada',
          rating: 4.7,
          priceRange: '$$$',
          pricePerNight: 230,
          imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          amenities: 'Rooftop Hot Pools, Gas Fireplace, Italian Pacini Restaurant, Meadow Spa',
          latitude: 51.1804,
          longitude: -115.5699,
        },
      ],
      attractions: [
        {
          name: 'Lake Moraine & Valley of the Ten Peaks',
          category: 'Glacial Lake',
          description: 'A glacially fed lake in Banff with vividly brilliant cyan waters framed by ten staggering mountain pinnacles.',
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Sunrise (6:00 AM)',
          latitude: 51.3217,
          longitude: -116.1860,
        },
        {
          name: 'Banff Gondola & Sulphur Mountain',
          category: 'Scenic Viewpoint',
          description: 'Scenic cableway ascent to 7,486 ft summit offering 360-degree panoramic sweeps across six Canadian Rocky mountain ranges.',
          imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          bestTimeOfDay: 'Golden Hour (4:00 PM - 6:30 PM)',
          latitude: 51.1481,
          longitude: -115.5558,
        },
      ],
    },
    {
      name: 'Cape Town',
      country: 'South Africa',
      region: 'Western Cape',
      continent: 'Africa',
      latitude: -33.9249,
      longitude: 18.4241,
      tagline: 'Dramatic Ocean Clifftops, Table Mountain & Wine Valleys',
      description: 'A port city on South Africa’s southwest coast, on a peninsula beneath the imposing flat-topped Table Mountain, boasting coastal drives, vibrant culture, and world-class wineries.',
      imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1600&q=80',
      rating: 4.8,
      travelInfo: {
        bestTimeToVisit: 'November to April (warm, dry summer months with endless beach sunshine)',
        currency: 'South African Rand (ZAR / R)',
        language: 'English, Afrikaans, isiXhosa',
        safetyNotes: 'Stick to well-lit tourist areas, use Uber for night transit, and keep valuables discreet when exploring city centers.',
        localTips: 'Ascend Table Mountain on the first clear sunny day you get, as clouds ("the tablecloth") can roll in swiftly.',
        timeZone: 'UTC+2 (SAST)',
        emergencyContact: '10111 (Police), 10177 (Ambulance)',
      },
      hotels: [
        {
          name: 'The Silo Hotel',
          address: 'Silo Square, V&A Waterfront, Cape Town',
          rating: 4.9,
          priceRange: '$$$$',
          pricePerNight: 820,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          amenities: 'Architectural Masterpiece, Rooftop Pool with Harbor View, Contemporary Art Museum Access',
          latitude: -33.9080,
          longitude: 18.4230,
        },
        {
          name: 'Radisson RED V&A Waterfront',
          address: 'Silo 6, Silo Square, V&A Waterfront, Cape Town',
          rating: 4.6,
          priceRange: '$$$',
          pricePerNight: 210,
          imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          amenities: 'Rooftop Bar & Pool, Modern Urban Decor, Pet Friendly, Free WiFi',
          latitude: -33.9095,
          longitude: 18.4215,
        },
      ],
      attractions: [
        {
          name: 'Table Mountain Aerial Cableway',
          category: 'Natural Wonder',
          description: 'A rotating cable car taking visitors to the summit of the iconic flat-topped landmark with breathtaking views of the city and Atlantic Ocean.',
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Morning (8:30 AM)',
          latitude: -33.9575,
          longitude: 18.4030,
        },
        {
          name: 'Boulders Beach Penguin Colony',
          category: 'Wildlife Sanctuary',
          description: 'Sheltered sandy cove in Simon’s Town home to a protected land-based colony of thousands of African Penguins.',
          imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          bestTimeOfDay: 'Afternoon (1:00 PM - 3:30 PM)',
          latitude: -34.1973,
          longitude: 18.4513,
        },
      ],
    },
    {
      name: 'Paris',
      country: 'France',
      region: 'Île-de-France',
      continent: 'Europe',
      latitude: 48.8566,
      longitude: 2.3522,
      tagline: 'City of Light, Haute Couture, Boulevards & Haute Cuisine',
      description: "France's capital, a major European city and global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.",
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
      rating: 4.8,
      travelInfo: {
        bestTimeToVisit: 'April to May (Spring blooms) or September to October (Crisp autumn light)',
        currency: 'Euro (EUR / €)',
        language: 'French (Basic polite greetings like "Bonjour" and "Merci" are greatly appreciated)',
        safetyNotes: 'Be mindful of pickpockets around Eiffel Tower, Montmartre, and major Metro transfers like Châtelet.',
        localTips: 'Pre-book Louvre and Musee d’Orsay time-slots online. Take an evening cruise along the Seine to see monuments lit up.',
        timeZone: 'UTC+1 (CET)',
        emergencyContact: '112 (EU Emergency), 15 (SAMU Medical), 17 (Police)',
      },
      hotels: [
        {
          name: 'Le Bristol Paris',
          address: '112 Rue du Faubourg Saint-Honoré, 75008 Paris',
          rating: 4.9,
          priceRange: '$$$$',
          pricePerNight: 980,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          amenities: 'Rooftop Swimming Pool, 3 Michelin Star Epicure, French Gardens, Spa Le Bristol',
          latitude: 48.8718,
          longitude: 2.3148,
        },
        {
          name: 'Hôtel Plaza Athénée',
          address: '25 Avenue Montaigne, 75008 Paris',
          rating: 4.8,
          priceRange: '$$$$',
          pricePerNight: 890,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          amenities: 'Signature Red Geranium Courtyard, Haute Cuisine, Dior Spa, Eiffel Tower Views',
          latitude: 48.8660,
          longitude: 2.3040,
        },
      ],
      attractions: [
        {
          name: 'Eiffel Tower & Champ de Mars',
          category: 'Historic Monument',
          description: 'Wrought-iron lattice tower on the Champ de Mars, the defining symbol of Paris offering sweeping views.',
          imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Sunset & Sparkle Hour (8:00 PM - 10:00 PM)',
          latitude: 48.8584,
          longitude: 2.2945,
        },
        {
          name: 'Louvre Museum',
          category: 'Fine Arts Museum',
          description: 'The world’s largest art museum and historic monument housing Mona Lisa, Venus de Milo, and over 35,000 works of art.',
          imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          bestTimeOfDay: 'Morning (9:00 AM) or Wednesday Evening',
          latitude: 48.8606,
          longitude: 2.3376,
        },
      ],
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      region: 'Lesser Sunda Islands',
      continent: 'Asia',
      latitude: -8.4095,
      longitude: 115.1889,
      tagline: 'Emerald Rice Terraces, Spiritual Sanctuaries & Tropical Surf',
      description: 'An Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple.',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
      rating: 4.8,
      travelInfo: {
        bestTimeToVisit: 'April to October during the dry season for low humidity and sunny surf conditions',
        currency: 'Indonesian Rupiah (IDR / Rp)',
        language: 'Indonesian, Balinese (English widely spoken in tourism hubs)',
        safetyNotes: 'Wear a helmet if renting a scooter; drink bottled or filtered water (avoid tap water); respect local temple sarong codes.',
        localTips: 'Visit Ubud for cultural arts, holistic wellness and yoga, and Seminyak/Canggu for sunsets, beach clubs, and cafes.',
        timeZone: 'UTC+8 (WITA)',
        emergencyContact: '112 (General Emergency), 110 (Police), 118 (Ambulance)',
      },
      hotels: [
        {
          name: 'Four Seasons Resort Bali at Sayan',
          address: 'Jl. Raya Sayan, Ubud, Bali 80571',
          rating: 4.9,
          priceRange: '$$$$',
          pricePerNight: 780,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          amenities: 'Suspension Bridge Entrance, Ayung Riverfront Villas, Sacred River Spa, Yoga Pavilion',
          latitude: -8.5020,
          longitude: 115.2410,
        },
        {
          name: 'The Kayon Jungle Resort',
          address: 'Banjar Bresela, Payangan, Ubud, Bali',
          rating: 4.8,
          priceRange: '$$$$',
          pricePerNight: 450,
          imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          amenities: 'Three-Tiered Terrace Pool, Serapian Spa, Jungle Cinema, Luxury Valley Suites',
          latitude: -8.4350,
          longitude: 115.2650,
        },
      ],
      attractions: [
        {
          name: 'Tegallalang Rice Terraces',
          category: 'Cultural Landscape',
          description: 'Spectacular tiered emerald paddies using the traditional centuries-old Balinese Subak irrigation system.',
          imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
          rating: 4.7,
          bestTimeOfDay: 'Early Morning (6:30 AM)',
          latitude: -8.4333,
          longitude: 115.2789,
        },
        {
          name: 'Uluwatu Temple & Kecak Dance',
          category: 'Cliffside Shrine',
          description: 'Majestic sea temple perched on a steep cliff 70 meters above the roaring Indian Ocean, featuring hypnotic sunset fire dances.',
          imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Sunset (5:30 PM)',
          latitude: -8.8291,
          longitude: 115.0849,
        },
      ],
    },
    {
      name: 'Rome',
      country: 'Italy',
      region: 'Lazio',
      continent: 'Europe',
      latitude: 41.9028,
      longitude: 12.4964,
      tagline: 'The Eternal City, Gladiators, Piazzas & Culinary Perfection',
      description: "Rome, Italy's sprawling capital, showcases nearly 3,000 years of globally influential art, architecture and culture. Ancient ruins such as the Forum and the Colosseum evoke the power of the former Roman Empire.",
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80',
      rating: 4.9,
      travelInfo: {
        bestTimeToVisit: 'April to June or late September to October (mild Mediterranean temperatures and manageable lines)',
        currency: 'Euro (EUR / €)',
        language: 'Italian (English common in tourist areas)',
        safetyNotes: 'Watch out for petty pickpocketing around Termini Station and crowded buses like line 64.',
        localTips: 'Drink from the free "nasoni" freshwater fountains across the city. Try authentic carbonara in Trastevere.',
        timeZone: 'UTC+1 (CET)',
        emergencyContact: '112 (Universal Emergency), 113 (Police), 118 (Medical)',
      },
      hotels: [
        {
          name: 'Hotel de Russie, a Rocco Forte Hotel',
          address: 'Via del Babuino, 9, 00187 Roma',
          rating: 4.8,
          priceRange: '$$$$',
          pricePerNight: 790,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          amenities: 'Terraced Secret Gardens, Le Jardin de Russie, Wellness Center, Near Piazza del Popolo',
          latitude: 41.9095,
          longitude: 12.4780,
        },
        {
          name: 'Singer Palace Hotel',
          address: 'Via Alessandro Specchi, 10, 00186 Roma',
          rating: 4.7,
          priceRange: '$$$',
          pricePerNight: 340,
          imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
          amenities: 'Art Deco Style, Rooftop Lounge with Roman Rooftop Views, Steps from Trevi Fountain',
          latitude: 41.8988,
          longitude: 12.4812,
        },
      ],
      attractions: [
        {
          name: 'The Colosseum & Roman Forum',
          category: 'Ancient Amphitheatre',
          description: 'The monumental oval amphitheatre in the centre of Rome, once hosting 50,000 spectators for gladiatorial contests.',
          imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Morning (8:30 AM)',
          latitude: 41.8902,
          longitude: 12.4922,
        },
        {
          name: 'Trevi Fountain & Pantheon',
          category: 'Baroque Monument',
          description: 'Famous 18th-century fountain where visitors toss a coin to ensure their return to Rome, adjacent to the ancient Pantheon dome.',
          imageUrl: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          bestTimeOfDay: 'Night / Early Morning (7:00 AM)',
          latitude: 41.9009,
          longitude: 12.4833,
        },
      ],
    },
    {
      name: 'Queenstown',
      country: 'New Zealand',
      region: 'Otago',
      continent: 'Oceania',
      latitude: -45.0312,
      longitude: 168.6626,
      tagline: 'Adventure Capital of the World & Fiordland Gateway',
      description: "Queenstown, New Zealand, sits on the shores of the South Island's Lake Wakatipu, set against the dramatic Southern Alps. Renowned for adventure sports and stunning alpine fjords like Milford Sound.",
      imageUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1600&q=80',
      rating: 4.9,
      travelInfo: {
        bestTimeToVisit: 'December to February (warm summer alpine days) or June to August for world-class skiing on Coronet Peak & The Remarkables',
        currency: 'New Zealand Dollar (NZD / $)',
        language: 'English, Māori',
        safetyNotes: 'Very safe destination. Follow strict outdoor safety guidance for alpine trekking and weather shifts.',
        localTips: 'Grab a famous Fergburger in town (go during off-peak hours to avoid the line). Book a day tour to Milford Sound.',
        timeZone: 'UTC+12 (NZST)',
        emergencyContact: '111 (Fire, Police, Ambulance)',
      },
      hotels: [
        {
          name: 'Matakauri Lodge',
          address: '569 Glenorchy Road, Queenstown 9348',
          rating: 4.9,
          priceRange: '$$$$',
          pricePerNight: 950,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          amenities: 'Lakeside Suites, Infinity Pool overlooking Lake Wakatipu, Private Chef, Spa',
          latitude: -45.0530,
          longitude: 168.5820,
        },
        {
          name: 'The Rees Hotel & Luxury Apartments',
          address: '377 Frankton Road, Queenstown 9300',
          rating: 4.8,
          priceRange: '$$$',
          pricePerNight: 290,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          amenities: 'True South Dining, Wine Lounge, Private Wharf, Mountain Views, Ski Shuttle',
          latitude: -45.0290,
          longitude: 168.6850,
        },
      ],
      attractions: [
        {
          name: 'Skyline Gondola & Bob’s Peak',
          category: 'Alpine Adventure',
          description: 'Steepest cable car lift in the Southern Hemisphere carrying passengers 450 meters above Queenstown to panoramic vistas and gravity-fueled luge tracks.',
          imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Afternoon & Sunset (4:00 PM - 7:00 PM)',
          latitude: -45.0280,
          longitude: 168.6540,
        },
        {
          name: 'Milford Sound Cruise Excursion',
          category: 'Fjord Wonder',
          description: 'A breathtaking fiord with sheer rock faces towering 1,200 meters out of dark waters, cascading waterfalls, and seal colonies.',
          imageUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80',
          rating: 5.0,
          bestTimeOfDay: 'Full Day Excursion (Departure 7:30 AM)',
          latitude: -44.6716,
          longitude: 167.9256,
        },
      ],
    },
    {
      name: 'Rio de Janeiro',
      country: 'Brazil',
      region: 'Southeast',
      continent: 'Americas',
      latitude: -22.9068,
      longitude: -43.1729,
      tagline: 'Samba Rhythms, Copacabana Sands & Christ the Redeemer',
      description: 'A huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop Mount Corcovado and for Sugarloaf Mountain, a granite peak with cable cars to its summit.',
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=80',
      rating: 4.8,
      travelInfo: {
        bestTimeToVisit: 'December to March (warm summer, beach energy, and Carnival celebrations)',
        currency: 'Brazilian Real (BRL / R$)',
        language: 'Portuguese',
        safetyNotes: 'Keep flashy jewelry and expensive phones in pockets while on the beach; use licensed taxis or rideshare after dusk.',
        localTips: 'Sip fresh coconut water (água de coco) along the Ipanema boardwalk and catch the sunset at Arpoador rock.',
        timeZone: 'UTC-3 (BRT)',
        emergencyContact: '190 (Military Police), 192 (Ambulance), 193 (Firefighters)',
      },
      hotels: [
        {
          name: 'Belmond Copacabana Palace',
          address: 'Avenida Atlântica 1702, Copacabana, Rio de Janeiro',
          rating: 4.9,
          priceRange: '$$$$',
          pricePerNight: 650,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          amenities: 'Historic Art Deco Façade, Semi-Olympic Pool, Cipriani Restaurant, Private Beach Service',
          latitude: -22.9675,
          longitude: -43.1788,
        },
        {
          name: 'Hotel Fasano Rio de Janeiro',
          address: 'Avenida Vieira Souto 80, Ipanema, Rio de Janeiro',
          rating: 4.8,
          priceRange: '$$$$',
          pricePerNight: 720,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          amenities: 'Philippe Starck Design, Rooftop Infinity Pool overlooking Ipanema Beach, Baretto-Londra Bar',
          latitude: -22.9868,
          longitude: -43.1973,
        },
      ],
      attractions: [
        {
          name: 'Christ the Redeemer & Corcovado',
          category: 'World Wonder',
          description: 'An Art Deco statue of Jesus Christ created by French sculptor Paul Landowski, standing 30 meters tall atop Corcovado mountain.',
          imageUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Early Morning (8:00 AM)',
          latitude: -22.9519,
          longitude: -43.2105,
        },
        {
          name: 'Sugarloaf Mountain (Pão de Açúcar)',
          category: 'Natural Monolith',
          description: 'A 396-meter granite peak at the mouth of Guanabara Bay accessed by panoramic glass-walled cable cars.',
          imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          bestTimeOfDay: 'Golden Hour / Sunset (5:00 PM)',
          latitude: -22.9492,
          longitude: -43.1545,
        },
      ],
    },
  ];

  for (const item of destinationsData) {
    const { travelInfo, hotels, attractions, ...destInfo } = item;

    const destination = await prisma.destination.create({
      data: {
        ...destInfo,
        travelInfo: {
          create: travelInfo,
        },
        hotels: {
          create: hotels,
        },
        attractions: {
          create: attractions,
        },
      },
    });

    console.log(` ✅ Seeded: ${destination.name}, ${destination.country}`);
  }

  // Create initial search history for regularUser
  const kyoto = await prisma.destination.findFirst({ where: { name: 'Kyoto' } });
  const santorini = await prisma.destination.findFirst({ where: { name: 'Santorini' } });

  if (kyoto && regularUser) {
    await prisma.searchHistory.create({
      data: {
        userId: regularUser.id,
        destinationId: kyoto.id,
      },
    });
  }

  if (santorini && regularUser) {
    await prisma.searchHistory.create({
      data: {
        userId: regularUser.id,
        destinationId: santorini.id,
      },
    });
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('👨‍💻 Traveler User: user@travel.com | Traveler123!');
  console.log('🛡️ Admin User:    admin@travel.com | Admin123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
