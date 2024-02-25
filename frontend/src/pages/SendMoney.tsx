import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {toast} from "sonner";

const SendMoney = () => {

    const [searchParams] = useSearchParams();

    const [ amount, setAmount ] = useState(0);
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
    }, [balance]);

    const navigate = useNavigate();

    const id: number = Number(searchParams.get("id"));
    const name = searchParams.get("name");

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div
                    className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
                >
                    <div className="flex flex-col space-y-1.5 p-6 items-center">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                        <h2>Your balance: {balance}</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">A</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => {
                                        try {
                                            const parsedValue = Number(e.target.value);
                                            setAmount(parsedValue);
                                        } catch (error) {
                                            // Handle error if conversion fails
                                            toast.error("Please enter a valid number");
                                        }
                                    }}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    try{
                                        if(amount <= balance){
                                            axios.post("http://localhost:4000/api/v1/account/transfer", {
                                                to: id,
                                                amount
                                            }, {
                                                headers: {
                                                    Authorization: "Bearer " + localStorage.getItem("token")
                                                }
                                            });
                                            toast.success(`Rs${amount} successfully sent to ${name}`);
                                            navigate('/dashboard');
                                        } else {
                                            toast.error("Not enough money in your account");
                                        }
                                    }catch (e) {
                                        console.log("Error", e);
                                        toast.error(`Couldn't send money to ${name}`);
                                    }
                                }}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                            >
                                Initiate Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMoney;