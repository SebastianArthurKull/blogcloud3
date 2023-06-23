import {useEffect, useState} from "react";
import {getAllUsers, updateUser} from "@lib/api";
import {Card} from "react-bootstrap";
import User from "@components/User";

export default function UsersPage({session, query}) {

    const [users, setUsers] = useState([])


    useEffect(() => {
        const loadPosts = async () => {
            const tempData = await getAllUsers()
            setUsers(tempData.filter(user => user.name.toLowerCase().includes(query.toLowerCase())))
        }
        loadPosts()
    }, [query])

    const handleFollow = async (userToFollow) => {
        console.log(session.user)
        let tempData = session.user
        if (tempData.follows.includes(userToFollow.id)) {
            tempData.follows = tempData.follows.filter(id => id !== userToFollow.id)
        } else {
            tempData.follows.push(userToFollow.id)
        }

        try {
            let newPostReply = await updateUser(tempData, session.accessToken)
            session.updateSessionUser(newPostReply)
        } catch (error) {
            alert(error)
        }
    }

    return (<Card style={{width: 'auto'}}>


        {
            users.map(user => {
                return (<User handleFollow={handleFollow} key={user.id} user={user} session={session}></User>)
            })
        }

    </Card>)
}