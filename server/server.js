import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Travel Discovery API server is running on http://localhost:${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🌍 Destinations: http://localhost:${PORT}/api/v1/destinations`);
});
