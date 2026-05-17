const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Property = require('./models/Property');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Property.deleteMany();

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const createdUsers = await User.insertMany([
      { name: 'Rahul Sharma', email: 'rahul@example.com', password: hashedPassword, googleId: 'g1', role: 'owner', profileCompleted: true, phoneNumber: '9881234567', city: 'Pune' },
      { name: 'Priya Patel', email: 'priya@example.com', password: hashedPassword, googleId: 'g2', role: 'owner', profileCompleted: true, phoneNumber: '8805671234', city: 'Mumbai' },
      { name: 'Amit Patel', email: 'amit.patel@gmail.com', password: hashedPassword, googleId: 'g3', role: 'owner', profileCompleted: true, phoneNumber: '7709876543', city: 'Pune' },
      { name: 'Tenant Demo', email: 'tenant@example.com', password: hashedPassword, googleId: 'g4', role: 'user', profileCompleted: true, phoneNumber: '9011223344', city: 'Pune' }
    ]);

    const owner1 = createdUsers[0]._id;
    const owner2 = createdUsers[1]._id;
    // createdUsers[2] is the empty owner (no properties)

    await Property.insertMany([
      {
        title: 'Luxurious 2BHK in Kothrud',
        description: 'Spacious and well-lit 2BHK flat with modern amenities.',
        propertyType: 'flat',
        rent: 25000,
        deposit: 50000,
        city: 'Pune',
        address: 'Kothrud',
        location: { type: 'Point', coordinates: [73.8077, 18.5074] }, // Pune Kothrud Approx
        amenities: ['Parking', 'Lift', 'Balcony', 'Power Backup'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        ownerId: owner1,
        available: true,
        filters: { bhk: '2BHK', furnishing: 'Semi Furnished', tenantPreference: ['Family Allowed'] }
      },
      {
        title: 'Road Touch Commercial Shop',
        description: 'Prime location shop suitable for retail or small office.',
        propertyType: 'shop',
        rent: 40000,
        deposit: 100000,
        city: 'Pune',
        address: 'Deccan Gymkhana',
        location: { type: 'Point', coordinates: [73.8400, 18.5167] }, // Deccan Pune Approx
        amenities: ['Parking', 'Water Supply'],
        images: ['https://images.unsplash.com/photo-1542361345-89e58247f2d5?w=800'],
        ownerId: owner2,
        available: true,
        filters: { shopFeatures: ['Road Touch', 'Commercial Area', 'Washroom'] }
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
