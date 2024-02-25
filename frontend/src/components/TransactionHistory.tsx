import {useEffect, useState} from "react";
import axios from "axios";

interface TransactionData {
    id: number;
    userId: number;
    accountId: number;
    amount: number;
    description: string;
    createdAt: string;
}
const TransactionHistory = () => {
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    useEffect(() => {
        const fetchTransactions = async ( ) => {
            try{
                const response = await axios.get<{ transactions: TransactionData[] }>('http://localhost:4000/api/v1/account/history', {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });
                // @ts-ignore
                setTransactions(response.data.transactions.reverse());
            }catch (e) {
                console.log(e);
            }
        }
        fetchTransactions()
    }, []);
    return (
        <div>
            <h1 className='font-bold mt-6 text-lg'>Transaction History</h1>
            <ul>
                {transactions.map((transaction: TransactionData) => (
                    <li key={transaction.id}
                        className={transaction.amount > 0 ? 'bg-green-300 rounded-md mt-3 p-2' : 'bg-red-300 rounded-md mt-3 p-2'}>
                        <div className='flex gap-1'>
                            <div className='font-bold'>Amount:</div>
                            <div>{transaction.amount}</div>
                        </div>
                        <div className='flex gap-1'>
                            <div className='font-bold'>Date:</div>
                            <div>{new Date(transaction.createdAt).toLocaleString()}</div>
                        </div>
                        <div className='flex gap-1'>
                            <div className='font-bold'>Description:</div>
                            <div>{transaction.description}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionHistory;