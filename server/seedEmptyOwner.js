/**
 * Seeds diverse test properties for empty@example.com
 * Run: node seedEmptyOwner.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Property = require('./models/Property');
const connectDB = require('./config/db');

dotenv.config();

const EMPTY_EMAIL = 'empty@example.com';

// Pune-area coordinates [longitude, latitude] for nearby-search testing
const LOC = {
  kothrud: [73.8077, 18.5074],
  koregaon: [73.8964, 18.5362],
  hinjewadi: [73.7339, 18.5912],
  wakad: [73.7645, 18.5998],
  baner: [73.7845, 18.559],
  viman: [73.9146, 18.5679],
  deccan: [73.84, 18.5167],
  pimpri: [73.807, 18.6298],
  hadapsar: [73.926, 18.5089],
  aundh: [73.8077, 18.559],
  kharadi: [73.935, 18.551],
  magarpatta: [73.93, 18.515],
};

const IMG = {
  flat1: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  flat2: 'https://images.unsplash.com/photo-1502672260066-1c1ef2d93688?w=800',
  flat3: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  flat4: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  flat5: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  flat6: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800',
  shop1: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?w=800',
  shop2: 'https://images.unsplash.com/photo-1441986300917-6466bd776d93?w=800',
  shop3: 'https://images.unsplash.com/photo-1555529669-e93e9590f2b7?w=800',
  farm1: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  farm2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  farm3: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
};

const buildProperties = (ownerId) => [
  // ——— FLATS (12) ———
  {
    title: 'Compact 1RK Studio Near Metro',
    description: 'Ideal for students and working professionals. Walking distance to metro, compact kitchen, 24/7 water.',
    propertyType: 'flat',
    rent: 8500,
    deposit: 25000,
    city: 'Pune',
    address: 'Kothrud, Near Metro',
    location: { type: 'Point', coordinates: LOC.kothrud },
    amenities: ['WiFi', 'Water Supply', 'Power Backup'],
    images: [IMG.flat1, IMG.flat2],
    ownerId,
    filters: {
      bhk: '1RK',
      furnishing: 'Semi Furnished',
      bathroomType: 'Indian Toilet',
      tenantPreference: ['Student Friendly', 'Bachelor Allowed'],
      nearbyLocations: ['Near Metro', 'Near Bus Stop'],
    },
  },
  {
    title: 'Budget 1BHK in Wakad IT Hub',
    description: 'Close to IT parks, semi-furnished 1BHK with balcony. Veg-only building, family-friendly society.',
    propertyType: 'flat',
    rent: 14000,
    deposit: 42000,
    city: 'Pune',
    address: 'Wakad, Hinjewadi Road',
    location: { type: 'Point', coordinates: LOC.wakad },
    amenities: ['Parking', 'Balcony', 'Lift', 'Water Supply'],
    images: [IMG.flat2, IMG.flat3],
    ownerId,
    filters: {
      bhk: '1BHK',
      furnishing: 'Semi Furnished',
      bathroomType: 'Western Toilet',
      tenantPreference: ['Family Allowed', 'Veg Only'],
      nearbyLocations: ['Near College', 'Near Bus Stop'],
    },
  },
  {
    title: 'Fully Furnished 1BHK Koregaon Park',
    description: 'Premium locality, fully furnished with AC, WiFi, modular kitchen. Attached western bathroom.',
    propertyType: 'flat',
    rent: 22000,
    deposit: 66000,
    city: 'Pune',
    address: 'Koregaon Park',
    location: { type: 'Point', coordinates: LOC.koregaon },
    amenities: ['AC', 'WiFi', 'Parking', 'Lift', 'Balcony', 'CCTV', 'Power Backup'],
    images: [IMG.flat3, IMG.flat4, IMG.flat5],
    ownerId,
    filters: {
      bhk: '1BHK',
      furnishing: 'Furnished',
      bathroomType: 'Attached Bathroom',
      tenantPreference: ['Bachelor Allowed', 'Non-Veg Allowed'],
      nearbyLocations: ['Near Market', 'Near Hospital'],
    },
  },
  {
    title: 'Spacious 2BHK in Baner',
    description: 'Bright 2BHK with large living room, 2 balconies, covered parking. Gated society with lift and CCTV.',
    propertyType: 'flat',
    rent: 25000,
    deposit: 75000,
    city: 'Pune',
    address: 'Baner, Balewadi High Street',
    location: { type: 'Point', coordinates: LOC.baner },
    amenities: ['Parking', 'Lift', 'Balcony', 'CCTV', 'Power Backup', 'Water Supply'],
    images: [IMG.flat4, IMG.flat1],
    ownerId,
    filters: {
      bhk: '2BHK',
      furnishing: 'Semi Furnished',
      bathroomType: 'Attached Bathroom',
      tenantPreference: ['Family Allowed'],
      nearbyLocations: ['Near Market', 'Near Hospital'],
    },
  },
  {
    title: '2BHK Unfurnished Aundh',
    description: 'Raw 2BHK for long-term tenants who want to set up their own furniture. Quiet residential lane.',
    propertyType: 'flat',
    rent: 18000,
    deposit: 54000,
    city: 'Pune',
    address: 'Aundh, Parihar Chowk',
    location: { type: 'Point', coordinates: LOC.aundh },
    amenities: ['Parking', 'Water Supply'],
    images: [IMG.flat5, IMG.flat6],
    ownerId,
    filters: {
      bhk: '2BHK',
      furnishing: 'Unfurnished',
      bathroomType: 'Indian Toilet',
      tenantPreference: ['Family Allowed', 'Veg Only'],
      nearbyLocations: ['Near Bus Stop'],
    },
  },
  {
    title: 'Luxury 3BHK Viman Nagar',
    description: 'Premium 3BHK with 3 attached bathrooms, servant room, 2 covered parking slots, club access.',
    propertyType: 'flat',
    rent: 45000,
    deposit: 135000,
    city: 'Pune',
    address: 'Viman Nagar, Clover Village',
    location: { type: 'Point', coordinates: LOC.viman },
    amenities: ['AC', 'WiFi', 'Parking', 'Lift', 'Balcony', 'CCTV', 'Power Backup', 'Water Supply'],
    images: [IMG.flat6, IMG.flat4, IMG.flat3],
    ownerId,
    filters: {
      bhk: '3BHK',
      furnishing: 'Furnished',
      bathroomType: 'Attached Bathroom',
      tenantPreference: ['Family Allowed', 'Non-Veg Allowed'],
      nearbyLocations: ['Near Metro', 'Near Hospital', 'Near Market'],
    },
  },
  {
    title: '2BHK Near College Hinjewadi',
    description: 'Perfect for students sharing — 2BHK close to colleges and bus routes. Semi-furnished, WiFi ready.',
    propertyType: 'flat',
    rent: 19500,
    deposit: 58500,
    city: 'Pune',
    address: 'Hinjewadi Phase 1',
    location: { type: 'Point', coordinates: LOC.hinjewadi },
    amenities: ['WiFi', 'Lift', 'Balcony', 'Water Supply'],
    images: [IMG.flat1, IMG.flat3],
    ownerId,
    filters: {
      bhk: '2BHK',
      furnishing: 'Semi Furnished',
      bathroomType: 'Western Toilet',
      tenantPreference: ['Student Friendly', 'Bachelor Allowed'],
      nearbyLocations: ['Near College', 'Near Bus Stop'],
    },
  },
  {
    title: '1BHK Bachelor Friendly Kharadi',
    description: 'No restrictions for bachelors, non-veg cooking allowed. Western toilet, 24/7 security.',
    propertyType: 'flat',
    rent: 16000,
    deposit: 48000,
    city: 'Pune',
    address: 'Kharadi, EON IT Park Road',
    location: { type: 'Point', coordinates: LOC.kharadi },
    amenities: ['Parking', 'CCTV', 'WiFi', 'Power Backup'],
    images: [IMG.flat2, IMG.flat5],
    ownerId,
    filters: {
      bhk: '1BHK',
      furnishing: 'Furnished',
      bathroomType: 'Western Toilet',
      tenantPreference: ['Bachelor Allowed', 'Non-Veg Allowed'],
      nearbyLocations: ['Near College', 'Near Market'],
    },
  },
  {
    title: 'Affordable 1RK Hadapsar',
    description: 'Low-budget 1RK near railway and market. Indian toilet, shared building water supply.',
    propertyType: 'flat',
    rent: 7000,
    deposit: 21000,
    city: 'Pune',
    address: 'Hadapsar, Sadesatranali',
    location: { type: 'Point', coordinates: LOC.hadapsar },
    amenities: ['Water Supply'],
    images: [IMG.flat6],
    ownerId,
    filters: {
      bhk: '1RK',
      furnishing: 'Unfurnished',
      bathroomType: 'Indian Toilet',
      tenantPreference: ['Bachelor Allowed', 'Student Friendly'],
      nearbyLocations: ['Near Bus Stop', 'Near Market'],
    },
  },
  {
    title: '3BHK Family Home Magarpatta',
    description: 'Large 3BHK in integrated township. Parks, schools, and hospital within 1 km. Veg-only society.',
    propertyType: 'flat',
    rent: 38000,
    deposit: 114000,
    city: 'Pune',
    address: 'Magarpatta City',
    location: { type: 'Point', coordinates: LOC.magarpatta },
    amenities: ['Parking', 'Lift', 'Balcony', 'CCTV', 'Power Backup', 'Water Supply', 'WiFi'],
    images: [IMG.flat4, IMG.flat6, IMG.flat1],
    ownerId,
    filters: {
      bhk: '3BHK',
      furnishing: 'Semi Furnished',
      bathroomType: 'Attached Bathroom',
      tenantPreference: ['Family Allowed', 'Veg Only'],
      nearbyLocations: ['Near Hospital', 'Near College', 'Near Market'],
    },
  },
  {
    title: '2BHK Deccan Gymkhana Heritage',
    description: 'Charming flat near Deccan with high ceilings, 2 balconies, lift building from 2018.',
    propertyType: 'flat',
    rent: 28000,
    deposit: 84000,
    city: 'Pune',
    address: 'Deccan Gymkhana',
    location: { type: 'Point', coordinates: LOC.deccan },
    amenities: ['Lift', 'Balcony', 'Parking', 'Power Backup'],
    images: [IMG.flat3, IMG.flat2, IMG.flat5],
    ownerId,
    filters: {
      bhk: '2BHK',
      furnishing: 'Furnished',
      bathroomType: 'Western Toilet',
      tenantPreference: ['Family Allowed', 'Non-Veg Allowed'],
      nearbyLocations: ['Near Metro', 'Near Market'],
    },
  },
  {
    title: '1BHK Pimpri Industrial Area',
    description: 'Near Pimpri chinchwad industrial belt. Semi furnished, parking for 1 two-wheeler and 1 car.',
    propertyType: 'flat',
    rent: 12000,
    deposit: 36000,
    city: 'Pune',
    address: 'Pimpri, Old Mumbai Pune Road',
    location: { type: 'Point', coordinates: LOC.pimpri },
    amenities: ['Parking', 'Water Supply', 'Power Backup'],
    images: [IMG.flat1, IMG.flat6],
    ownerId,
    filters: {
      bhk: '1BHK',
      furnishing: 'Semi Furnished',
      bathroomType: 'Indian Toilet',
      tenantPreference: ['Family Allowed', 'Bachelor Allowed'],
      nearbyLocations: ['Near Bus Stop'],
    },
  },

  // ——— SHOPS (6) ———
  {
    title: 'Road Touch Shop Deccan',
    description: 'High footfall road-touch retail space, washroom inside, ideal for café or boutique.',
    propertyType: 'shop',
    rent: 55000,
    deposit: 165000,
    city: 'Pune',
    address: 'Deccan Gymkhana Main Road',
    location: { type: 'Point', coordinates: LOC.deccan },
    amenities: ['Parking', 'Water Supply', 'CCTV'],
    images: [IMG.shop1, IMG.shop2],
    ownerId,
    filters: {
      shopFeatures: ['Road Touch', 'Commercial Area', 'Washroom', 'Market Area'],
    },
  },
  {
    title: 'Highway Touch Warehouse Pimpri',
    description: 'Large warehouse-style unit with highway access, storage room, loading bay.',
    propertyType: 'shop',
    rent: 75000,
    deposit: 225000,
    city: 'Pune',
    address: 'Pimpri, Highway Touch',
    location: { type: 'Point', coordinates: LOC.pimpri },
    amenities: ['Parking', 'Power Backup', 'Water Supply'],
    images: [IMG.shop2, IMG.shop3],
    ownerId,
    filters: {
      shopFeatures: ['Highway Touch', 'Warehouse Type', 'Storage Room', 'Parking Available'],
    },
  },
  {
    title: 'Office Space Baner',
    description: 'Ready office setup with cabin partitions, AC points, washroom, 2 parking slots.',
    propertyType: 'shop',
    rent: 42000,
    deposit: 126000,
    city: 'Pune',
    address: 'Baner, IT Road',
    location: { type: 'Point', coordinates: LOC.baner },
    amenities: ['WiFi', 'Parking', 'CCTV', 'Power Backup'],
    images: [IMG.shop3, IMG.shop1],
    ownerId,
    filters: {
      shopFeatures: ['Office Type', 'Commercial Area', 'Washroom', 'Parking Available'],
    },
  },
  {
    title: 'Market Area Retail Wakad',
    description: 'Shop in busy market complex, ground floor, storage at back, heavy customer traffic.',
    propertyType: 'shop',
    rent: 35000,
    deposit: 105000,
    city: 'Pune',
    address: 'Wakad, Datta Mandir Chowk',
    location: { type: 'Point', coordinates: LOC.wakad },
    amenities: ['Water Supply', 'CCTV'],
    images: [IMG.shop1],
    ownerId,
    filters: {
      shopFeatures: ['Market Area', 'Commercial Area', 'Storage Room', 'Washroom'],
    },
  },
  {
    title: 'Compact Shop Kothrud',
    description: 'Small 250 sq ft shop suitable for mobile repair, tailor, or pharmacy.',
    propertyType: 'shop',
    rent: 22000,
    deposit: 66000,
    city: 'Pune',
    address: 'Kothrud, Paud Road',
    location: { type: 'Point', coordinates: LOC.kothrud },
    amenities: ['Water Supply'],
    images: [IMG.shop2],
    ownerId,
    filters: {
      shopFeatures: ['Road Touch', 'Washroom'],
    },
  },
  {
    title: 'Showroom Space Viman Nagar',
    description: 'Wide frontage showroom with glass facade, parking for customers, prime commercial strip.',
    propertyType: 'shop',
    rent: 90000,
    deposit: 270000,
    city: 'Pune',
    address: 'Viman Nagar, Nagar Road',
    location: { type: 'Point', coordinates: LOC.viman },
    amenities: ['Parking', 'CCTV', 'WiFi', 'Power Backup', 'Water Supply'],
    images: [IMG.shop3, IMG.shop2, IMG.shop1],
    ownerId,
    filters: {
      shopFeatures: ['Commercial Area', 'Road Touch', 'Parking Available', 'Market Area'],
    },
  },

  // ——— FARMHOUSES (6) ———
  {
    title: 'Pool Villa Lonavala Side',
    description: 'Weekend getaway with private pool, garden, party-friendly. Daily and weekly stays welcome.',
    propertyType: 'farmhouse',
    rent: 15000,
    deposit: 30000,
    city: 'Pune',
    address: 'Mulshi Road, Near Lonavala',
    location: { type: 'Point', coordinates: [73.468, 18.52] },
    amenities: ['Parking', 'Garden', 'WiFi', 'Power Backup', 'Water Supply'],
    images: [IMG.farm1, IMG.farm2, IMG.farm3],
    ownerId,
    filters: {
      farmhouseFeatures: ['Swimming Pool', 'Party Allowed', 'Garden', 'Parking'],
      stayOptions: ['Daily Stay', 'Weekly Stay'],
      maxGuests: 15,
    },
  },
  {
    title: 'Mountain View Farmhouse Tamhini',
    description: 'Scenic farmhouse with mountain views, bonfire area, 8 guest capacity. No pool.',
    propertyType: 'farmhouse',
    rent: 12000,
    deposit: 24000,
    city: 'Pune',
    address: 'Tamhini Ghat Road',
    location: { type: 'Point', coordinates: [73.55, 18.45] },
    amenities: ['Parking', 'Garden', 'Water Supply'],
    images: [IMG.farm2, IMG.farm1],
    ownerId,
    filters: {
      farmhouseFeatures: ['Mountain View', 'Garden', 'Parking', 'Party Allowed'],
      stayOptions: ['Daily Stay'],
      maxGuests: 8,
    },
  },
  {
    title: 'Lake View Cottage Mulshi',
    description: 'Peaceful lake-facing property, fishing allowed, ideal for family weekends. Weekly stay discount.',
    propertyType: 'farmhouse',
    rent: 18000,
    deposit: 36000,
    city: 'Pune',
    address: 'Mulshi Lake',
    location: { type: 'Point', coordinates: [73.52, 18.48] },
    amenities: ['Parking', 'Garden', 'Power Backup'],
    images: [IMG.farm3, IMG.farm2],
    ownerId,
    filters: {
      farmhouseFeatures: ['Lake View', 'Garden', 'Parking'],
      stayOptions: ['Daily Stay', 'Weekly Stay'],
      maxGuests: 10,
    },
  },
  {
    title: 'Budget Farm Stay Pune Outskirts',
    description: 'Simple farmhouse for large groups on budget. Garden, parking, no pool. Party till 10 PM.',
    propertyType: 'farmhouse',
    rent: 8000,
    deposit: 16000,
    city: 'Pune',
    address: 'Paud, Maval',
    location: { type: 'Point', coordinates: [73.75, 18.55] },
    amenities: ['Parking', 'Water Supply'],
    images: [IMG.farm1],
    ownerId,
    filters: {
      farmhouseFeatures: ['Garden', 'Parking', 'Party Allowed'],
      stayOptions: ['Daily Stay', 'Weekly Stay'],
      maxGuests: 20,
    },
  },
  {
    title: 'Luxury Farmhouse with Pool & BBQ',
    description: 'High-end property: infinity pool, landscaped garden, BBQ pit, sleeps 12. Events allowed.',
    propertyType: 'farmhouse',
    rent: 25000,
    deposit: 50000,
    city: 'Pune',
    address: 'Lavasa Road',
    location: { type: 'Point', coordinates: [73.5, 18.4] },
    amenities: ['Parking', 'Garden', 'WiFi', 'Power Backup', 'Water Supply'],
    images: [IMG.farm3, IMG.farm1, IMG.farm2],
    ownerId,
    filters: {
      farmhouseFeatures: ['Swimming Pool', 'Party Allowed', 'Garden', 'Mountain View', 'Parking'],
      stayOptions: ['Daily Stay', 'Weekly Stay'],
      maxGuests: 12,
    },
  },
  {
    title: 'Couple Retreat Farmhouse',
    description: 'Intimate 2–4 guest farmhouse, no parties, lake view terrace, perfect for couples.',
    propertyType: 'farmhouse',
    rent: 9000,
    deposit: 18000,
    city: 'Pune',
    address: 'Panshet Dam Area',
    location: { type: 'Point', coordinates: [73.6, 18.47] },
    amenities: ['Parking', 'WiFi'],
    images: [IMG.farm2, IMG.farm3],
    ownerId,
    filters: {
      farmhouseFeatures: ['Lake View', 'Garden', 'Parking'],
      stayOptions: ['Daily Stay'],
      maxGuests: 4,
    },
  },
];

const seed = async () => {
  try {
    await connectDB();

    let owner = await User.findOne({ email: EMPTY_EMAIL });
    if (!owner) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('123456', await bcrypt.genSalt(10));
      owner = await User.create({
        name: 'Empty Owner Demo',
        email: EMPTY_EMAIL,
        password: hashedPassword,
        googleId: 'g3-empty',
        role: 'owner',
        profileCompleted: true,
        phoneNumber: '9876543212',
        city: 'Pune',
      });
      console.log(`Created user ${EMPTY_EMAIL}`);
    }

    const deleted = await Property.deleteMany({ ownerId: owner._id });
    console.log(`Removed ${deleted.deletedCount} existing properties for ${EMPTY_EMAIL}`);

    const properties = buildProperties(owner._id);
    await Property.insertMany(properties);

    const counts = {
      flat: properties.filter((p) => p.propertyType === 'flat').length,
      shop: properties.filter((p) => p.propertyType === 'shop').length,
      farmhouse: properties.filter((p) => p.propertyType === 'farmhouse').length,
    };

    console.log(`\nSeeded ${properties.length} properties for ${EMPTY_EMAIL} (${owner.name})`);
    console.log(`  Flats: ${counts.flat} | Shops: ${counts.shop} | Farmhouses: ${counts.farmhouse}`);
    console.log('\nLogin: empty@example.com / password: 123456');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
