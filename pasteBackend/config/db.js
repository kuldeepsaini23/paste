import mongoose from "mongoose";
import env from "dotenv";
env.config();

const { MONGODB_URL } = process.env;

// Set strictQuery behavior
mongoose.set('strictQuery', true); // Or false, depending on your preference

export const connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`DB Connection Success`))
    .catch((err) => {
      console.log(`DB Connection Failed`);
      console.log(err);
      process.exit(1);
    });
};
