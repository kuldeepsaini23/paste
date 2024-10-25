import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./config/db.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
await connect();
//middlewares
app.use(express.json()); 
app.use(
	cors({
		origin:["http://localhost:5173", ],
		credentials:true,
	})
)



//routes
app.use("/api/v1", (await import("./routes/index.routes.js")).default);


//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
