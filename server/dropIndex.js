const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const drop = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.collection('users').dropIndex('googleId_1');
    console.log('Successfully dropped googleId_1 index');
  } catch (e) {
    console.log('Error:', e.message);
  }
  process.exit();
}

drop();
