import {useNavigate} from "react-router-dom";
import React from "react";
import {Button} from "./Button.tsx";

interface UserProps {
    user: any
}
export const User: React.FC<UserProps> = ({user}) => {
    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button label={"Send Money"} onClick={() => {
                navigate("/send-money?id=" + user.id + "&name=" + user.firstName);
            }}/>
        </div>
    </div>
}