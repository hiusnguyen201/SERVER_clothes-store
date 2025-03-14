import mongoose from 'mongoose';

export const connectToMongoDb = (options) => {
  if (options?.logging) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
  }

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected successfully to MongoDB');
    })
    .catch((err) => {
      console.error('Connect to MongoDB failed', err);
    });

  return mongoose.connection;
};
