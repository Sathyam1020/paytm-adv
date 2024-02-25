import {useEffect, useState} from "react"
import axios from "axios";
import {User} from "./User.tsx";

export const Users = () => {

    const [users, setUsers ] = useState([]);
    const [ filter, setFitler ] = useState("");

    useEffect(() => {
        axios.get("http://localhost:4000/api/v1/user/bulk?filter=" + filter, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(response => {
            setUsers(response.data.user)
        });
    }, [filter]);

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input type="text" onChange={e => setFitler(e.target.value)} placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div>
            {users.map(user => <User key={(user as any).id} user={user} />)}
        </div>
    </>
}
