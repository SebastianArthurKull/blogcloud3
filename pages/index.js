import {useEffect, useState} from "react";
import {getAllPosts} from "@lib/api";
import Post from "@components/Post";
import {Button} from "react-bootstrap";
import PostForm from "@components/PostForm";
import styles from "./styles/index.module.css";

export default function IndexPage({session, query}) {

    const [posts, setPost] = useState([])
    const [showCreatePost, setShowCreatePost] = useState(false)
    const [postToEdit, setPostToEdit] = useState({})
    const [edit, setEdit] = useState(false)

    const defaultModel = {
        title: "", content: "", ownerId: ""
    }


    useEffect(() => {
        const loadPosts = async () => {
            const tempData = await getAllPosts()
            if (session.isLoggedIn()) {
                let user = session.user
                setPost((tempData.filter(item => item.content.toLowerCase().includes(query.toLowerCase()) || item.title.toLowerCase().includes(query.toLowerCase())).filter(item => user.follows.includes(item.ownerId) || item.ownerId === user.id)))
            } else {
                setPost(tempData.filter(item => item.content.toLowerCase().includes(query.toLowerCase()) || item.title.toLowerCase().includes(query.toLowerCase())))
            }
        }
        loadPosts()
    }, [query, session])

    const handleClose = () => {
        setShowCreatePost(false)
    }

    const handleEdit = (post, bool) => {
        setEdit(bool)
        setPostToEdit(post)
        setShowCreatePost(!showCreatePost)
    }

    const handleDeletedPost = (id) => {
        setPost(posts.filter(post => post.id !== id))
    }

    const handleNewPost = (newPost) => {
        setPost([newPost, ...posts])
    }

    return (<section className={styles.index}>
        {session.isLoggedIn() &&
            <div className={styles.createButton} style={{color: "black"}} onClick={() => {
                setPostToEdit(defaultModel)
                setShowCreatePost(!showCreatePost)
                setEdit(false)
            }}>

            <Button className={"mt-2 ms-3 me-3 mb-2 "} variant={"secondary"} >+</Button>create a post</div>}

        {posts.map(post => {
            return (
                <Post handleNewPost={handleNewPost} key={post.id} post={post} session={session} handleEdit={handleEdit}
    handleDeletedPost={handleDeletedPost}/>)
        })}
        <PostForm edit={edit} session={session} show={showCreatePost} postToEdit={postToEdit} handleClose={handleClose}
                  handleNewPost={handleNewPost}/>
    </section>)
}