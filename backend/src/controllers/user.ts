import prisma from "../db.config";
import zod from "zod";
import jwt from "jsonwebtoken";
import { Response, Request } from 'express';

const signupBody = zod.object({
    email: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    username: zod.string(),
    password: zod.string()
});

const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string()
});

const signup = async(req: Request, res: Response) => {
    try {
        const { success } = signupBody.safeParse(req.body)
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        });

        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken"
            })
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            },
        });
        const userId = user.id;

        // Create account
        await prisma.account.create({
            data: {
                userId,
                balance: 10000
            }
        });

        const token = jwt.sign({
            userId
        }, process.env.JWT_SECRET as string)

        res.json({
            message: "User created successfully",
            token: token
        });
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        })
    }
}


const signin = async (req: Request, res: Response) => {
    try {
        const { success } = signinBody.safeParse(req.body)
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
                password: req.body.password
            }
        });

        if (user) {
            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET as string);

            res.json({
                token: token
            })
            return;
        }

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        })
    }
}

const bulkSearch = async(req: Request, res: Response){
    try {
        const filter = String(req.query.filter || "");

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { firstName: { contains: filter, mode: 'insensitive' } },
                    { lastName: { contains: filter, mode: 'insensitive' } }
                ]
            },
            select: {
                username: true,
                firstName: true,
                lastName: true,
                id: true
            }
        });

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id
            }))
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `No users found`,
        });
    }
}

export { signup, signin, bulkSearch};