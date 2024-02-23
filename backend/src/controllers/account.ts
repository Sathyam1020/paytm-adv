import prisma from "../db.config";
import { Response, Request } from 'express';
import user from "../routes/user";
interface AuthenticatedRequest extends Request {
    userId: number;
}

const getBalance = async(req: AuthenticatedRequest, res: Response) => {
    try{
        const userId: number = req.userId
        const account: any = await prisma.account.findFirst({
            where: {
                userId: userId
            }
        });
        return res.json({
            balance: account.balance
        })
    }catch (e) {
        console.log(e);

        return res.json({
            success: false,
            message: "Couldn't fetch user balance."
        })
    }
}

const getTransactionHistory = async(req: AuthenticatedRequest, res: Response) => {
    try{
        const userId: number = req.userId;
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: userId
            }
        });
        return res.json({
            transactions
        });
    }catch (e) {
        console.log(e);

        return res.json({
            success: false,
            message: "Couldn't find any transactions"
        })
    }
}

const transfer = async (req: AuthenticatedRequest, res: Response) => {

    const amount: number = req.body.amount;
    const to: number = req.body.to;

    if(to === req.userId){
        throw new Error("Not valid");
    }

    try {
        await prisma.$transaction(async () => {
            // Fetch sender's account
            const senderAccount = await prisma.account.findFirst({
                where: {
                    userId: req.userId
                }
            });

            if (!senderAccount || senderAccount.balance < amount) {
                throw new Error("Insufficient balance");
            }

            // Fetch recipient's account
            const recipientAccount = await prisma.account.findFirst({
                where: {
                    userId: to
                }
            });

            if (!recipientAccount) {
                throw new Error("Invalid recipient account");
            }

            // Deduct amount from sender's account
            await prisma.account.update({
                where: {
                    id: senderAccount.id
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            });

            // Add amount to recipient's account
            await prisma.account.update({
                where: {
                    id: recipientAccount.id
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            });

            // Log transaction
            await prisma.transaction.createMany({
                data: [
                    {
                        userId: req.userId,
                        accountId: senderAccount.id,
                        amount: -amount,
                        description: `Transferred ${amount} to ${to}`
                    },
                    {
                        userId: to,
                        accountId: recipientAccount.id,
                        amount: amount,
                        description: `Received ${amount} from ${req.userId}`
                    }
                ]
            });
        });

        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Transfer failed",
        });
    }
};

export { getBalance, transfer, getTransactionHistory };
