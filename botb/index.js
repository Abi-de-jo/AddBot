import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { residencyRoute } from "./routes/residencyRoute.js";
import { userRoute } from "./routes/userRoute.js";



dotenv.config();

const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})