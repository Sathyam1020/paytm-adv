import {useEffect, useState} from 'react'
import Appbar from '../components/Appbar';
import Balance from '../components/Balance';
import { Users } from '../components/Users';
import axios from "axios";
import TransactionHistory from "../components/TransactionHistory.tsx";

const Dashboard = () => {

    const [ balance, setBalance ] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/v1/account/balance', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    },
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };
        fetchBalance();
    }, []);
    return (
        <>
            <Appbar />
            <div className="m-8">
                <Balance value={balance} />
                <Users />
                <TransactionHistory />
            </div>
        </>
    )
}

export default Dashboard; 