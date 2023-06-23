import {useRouter} from "next/router"
import {useEffect, useState} from "react"
import {Card, Image, ListGroup} from "react-bootstrap";
import {getAllPosts, getUserById} from "@lib/api";
import Post from "@components/Post";

export default function IndexPage({session, query, handleEdit, handleDeletedPost}) {
    const router = useRouter()
    const { id } = router.query
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const loadUsers = async () => {
            const tempData = await getUserById(id, session.accessToken)
            setUser(tempData)
        }
        loadUsers()
    }, [session])

    useEffect(() => {
        const loadPosts = async () => {
            const tempData = await getAllPosts()
            await setPosts((tempData.filter(item => item.ownerId === user.id).filter(item => item.content.includes(query) || item.title.includes(query))))
        }
        loadPosts()
    }, [user, query])


    return (<>
        <Card.Header>
            <Image  src={user.avatar} alt={"Profile Picture"} rounded={true} height={200}/>
        </Card.Header>
        <ListGroup variant="flush">
            <ListGroup.Item style={{fontWeight : "bold"}}>
                {user.name}
            </ListGroup.Item>

            <ListGroup.Item>
                <div style={{fontStyle: "oblique"}}>Biography</div>
                {user.bio}</ListGroup.Item>

        </ListGroup>


        {posts.map(post => {
            return (<Post key={post.id} post={post} session={session} handleEdit={handleEdit} handleDeletedPost={handleDeletedPost}></Post>)
        })}


    </>)

}