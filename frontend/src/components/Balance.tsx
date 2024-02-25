import React from "react";

interface BalanceProps {
    value: number
}
const Balance: React.FC<BalanceProps> = ({
    value
}) => {
    return (
        <div className='flex'>
            <div className="font-bold text-lg">
                Your balance
            </div>
            <div className="font-semibold ml-4 text-lg">
                Rs {value}
            </div>
        </div>
    )
}

export default Balance;