import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { toast } from "sonner";
import {Heading} from "../components/Heading.tsx";
import {SubHeading} from "../components/SubHeading.tsx";
import {InputBox} from "../components/InputBox.tsx";
import {Button} from "../components/Button.tsx";
import {BottomWarning} from "../components/BottomWarning.tsx";


const Signup = () => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const onClick = async () => {
        try {
            const response = await axios.post("http://localhost:4000/api/v1/user/signup", {
                email,
                firstName,
                lastName,
                username,
                password
            });

            localStorage.setItem("token", response.data.token);
            toast.success("Account created successfully.");
            navigate('/dashboard');
        } catch (error) {
            console.error("Signup failed", error);
            toast.error("Error creating account. Please try again.");
        }
    };

    return (
        <div className='bg-slate-300 h-screen flex justify-center'>
            <div className='flex flex-col justify-center'>
                <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4 shadow-sm'>
                    <Heading label={"Sign up"}/>
                    <SubHeading label={"Enter your information to create an account"} />
                    <InputBox
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                        label={"Email"}
                        placeholder={"example@gmail.com"}
                    />
                    <InputBox
                        onChange={e => {
                            setFirstName(e.target.value);
                        }}
                        label={"First Name"}
                        placeholder={"Sathyam"}
                    />
                    <InputBox
                        onChange={e => {
                            setLastName(e.target.value);
                        }}
                        label={"Last Name"}
                        placeholder={"Sahu"}
                    />
                    <InputBox
                        onChange={e => {
                            setUsername(e.target.value);
                        }}
                        label={"Username"} placeholder={"Sathyam_1"}/>
                    <InputBox
                        onChange={e => {
                            setPassword(e.target.value);
                        }}
                        label={"Password"} placeholder={"PaSsword@78"}/>
                    <div className="pt-4">
                        <Button label={"Sign up"} onClick={onClick}/>
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    )
}

export default Signup;