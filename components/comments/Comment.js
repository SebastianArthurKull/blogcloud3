import {useEffect, useState} from "react";
import {deleteComment, getUserById, updateComment} from "@lib/api";
import { Dropdown, Form, Image} from "react-bootstrap";
import {useRouter} from "next/router";
import styles from "@components/style/Comment.module.css";



export default function Comment({comment, session, handleEditedComment, handleDeletedComment}) {
    const [user, setUser] = useState({})
    const [author, setAuthor] = useState(false)
    const [edit, setEdit] = useState(false)
    const [newComment, setNewComment] = useState(comment)
    const router = useRouter()

    useEffect(() => {
        const loadUser = async () => {
            setUser(await getUserById(comment["ownerId"]))
        }
        loadUser()

        if (session.isLoggedIn() && session.user.id === comment.ownerId) {
            setAuthor(true)
        }
    }, [comment, session])

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            await deleteComment(comment.id, session.accessToken)
            handleDeletedComment(comment.id)
        } catch (e) {
            alert(e)
        }
    }

    useEffect(() => {

    }, [newComment])

    const handleChange = (e) => {
        setNewComment({
            ...newComment,
            content: e.target.value
        })
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setEdit(false)
        try {
            newComment.updatedAt = new Date().toISOString()
            let newCommentReply = await updateComment(newComment, session.accessToken)
            setNewComment(newCommentReply)
            handleEditedComment(newCommentReply)
        } catch (e) {
            alert(e)
        }
    }

    return (<section key={comment.id} className={styles.commentBoarder} >
        <article className={styles.header}>
        <Image className={"m-1"} onClick={async () => await router.push(`/${comment.ownerId}/`)} src={user.avatar} alt={"Profile Picture"} rounded={true} height={50}/>
        <section>{user.name}</section>
            {author &&
                <Dropdown >
                    <Dropdown.Toggle className={"m-1"} variant="light" id="dropdown-basic">
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item className={styles.clickableSpan} onClick={() => setEdit(!edit)} href="#/action-1" >Edit Comment</Dropdown.Item>
                        <Dropdown.Item href="#/action-2" className={`${styles.clickableSpan} ${styles.delete}`}
                                       onClick={handleDelete}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>}
        </article>

        <article>
            {comment.content}
        </article>
        {edit && author && <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label></Form.Label>
                <Form.Control required onChange={handleChange} name="content" type="text"
                              placeholder={comment.content}
                              value={newComment.content}/>
            </Form.Group>
        </Form>}
    </section>)

}

