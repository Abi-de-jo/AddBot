import asyncHandler from "express-async-handler";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt"





export const createUser = asyncHandler(async (req, res) => {
    console.log("creating a admin");

    let { email, password } = req.body;
    try {
        const adminExists = await prisma.user.findUnique({ where: { email: email } });
        // HASH THE PASSWORD

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);
        if (!adminExists) {
            const admin = await prisma.user.create({ data: { email: email, password: hashedPassword } });

            res.send({
                message: "admin registered successfully",
                admin: admin,
            });
        } else res.status(201).send({ message: "admin already registered" });

    } catch (err) {
        console.log(err)
    }

});



