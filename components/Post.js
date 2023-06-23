import {Button, Card, Dropdown, Figure, Image, Image as BsImage} from "react-bootstrap";
import {useEffect, useState} from "react";
import {createComment, deletePost, getCommentsByPostId, getUserById, updatePost} from "@lib/api";
import Comments from "@components/comments/Comments";
import styles from "./style/Post.module.css"
import {useRouter} from "next/router";

const defaultModel = {id: null, postId: null, ownerId: null, content: ""}

export default function Post({post, session, handleEdit, handleDeletedPost}) {
    const [user, setUser] = useState({})
    const [showComments, setShowComments] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [author, setAuthor] = useState(false)
    const router = useRouter()
    const [model, setModel] = useState(defaultModel)
    const [commentCounter, setCommentCounter] = useState(0)
    const [comments, setComments] = useState([])
    const [likeAmount, setLikeAmount] = useState(0)
    const [like, setLike] = useState(false)

    const handleShowComments = () => setShowComments(!showComments)

    useEffect(() => {
        session.isLoggedIn() && setLike(post.likes.includes(session.user.id))
        setLikeAmount(post.likes.length)
    }, [post, session])

    useEffect(() => {
        const loadUser = async () => {
            setUser(await getUserById(post["ownerId"]))
        }
        loadUser()
        if (session.user && session.user.id === post.ownerId) {
            setAuthor(true)
        }
    }, [post, session.user])

    useEffect(() => {
        const loadComments = async () => {
            if (post.id) {
                setComments(await getCommentsByPostId(post.id))
            }
        }
        loadComments()
        setLikeAmount(post.likes.length)
    }, [post.id, post.likes.length])

    useEffect(() => {
        if (session.isLoggedIn() && post.id && session.user.id) {
            setModel({...defaultModel, postId: post.id, ownerId: session.user.id})
            setLike(post.likes.includes(session.user.id))
            setLikeAmount(post.likes.length)
        }
    }, [post.id, session, post.likes])

    const handleSubmit = async (e) => {
        e.preventDefault()
        model.createdAt = new Date().toISOString()
        model.updatedAt = new Date().toISOString()
        let newComment = await createComment(model, session.accessToken)
        setCommentCounter(commentCounter + 1)
        setModel({...model, content: ""})
        setComments([...comments, newComment])
    }

    const handleEditedComment = (editedComment) => {
        setComments(oldComments => oldComments.map(comment => {
            if (comment.id === editedComment.id) {
                return editedComment
            } else {
                return comment
            }
        }))
    }

    const handleDeletedComment = (id) => {
        setComments(comments.filter(comment => comment.id !== id))
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            await deletePost(post.id, session.accessToken)
            handleDeletedPost(post.id)
            setComments(comments.filter(comment => comment.id !== post.id))
            setCommentCounter(commentCounter - 1)
        } catch (e) {
            alert(e)
        }
    }

    const handleChange = (e) => {
        setModel({...model, [e.target.name]: e.target.value})
    }

    const handleLikeClick = async () => {
        if (session.isLoggedIn()) {
            let tempData = post
            if (!tempData.likes.includes(session.user.id)) {
                tempData.likes.push(session.user.id)
            } else {
                tempData.likes = tempData.likes.filter(id => id !== session.user.id)
            }
            try {
                let newPostReply = await updatePost(tempData, session.accessToken)
                setLikeAmount(newPostReply.likes.length)
                setLike(newPostReply.likes.includes(session.user.id))
            } catch (error) {
                alert(error)
            }
        }
    }

    return (<article className={styles.post}>
        <Card>
            <Card.Header className={` ${styles.header} `}>
                <BsImage onClick={async () => await router.push(`/users/${post.ownerId}/`)} src={user.avatar}
                         alt={"Profile Picture"} rounded={true} height={50}/>
                <p className={"ms-3"}>{user.name}</p>
                {session.isLoggedIn() && author && <Dropdown>
                    <Dropdown.Toggle className={"m-1"} variant="light" id="dropdown-basic">
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item className={styles.clickableSpan} onClick={() => handleEdit(post, true)}
                                       href="#/action-1">Edit Post</Dropdown.Item>
                        <Dropdown.Item href="#/action-2" className={`${styles.clickableSpan} ${styles.delete}`}
                                       onClick={handleDelete}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>}
            </Card.Header>
            <Card.Body>
                {(post.avatar !== []) &&
                    <table>
                        <tbody>
                        <tr>
                            {post.avatar.map((path, index) => {
                                return (
                                    <th key={index}>
                                        <Figure className={styles.postImage}>
                                            <Image
                                                width={171}
                                                alt="171x180"
                                                src={path.toString()}/>
                                        </Figure>
                                    </th>
                                )
                            })}
                        </tr>
                        </tbody>
                    </table>}
                <Card.Title>{post.title}</Card.Title>
                <Card.Text className={styles.body}>
                    <>
                        {showMore ? post.content : (post.content.length > 250) ? post.content.substring(0, 250) + "..." : post.content}
                        {(post.content.length > 250) &&
                            <span className={styles.clickableSpan}
                                                             onClick={() => setShowMore(!showMore)}> show {showMore ? "less" : "more"}</span>}
                    </>
                </Card.Text>
                {session.isLoggedIn() && <Button onClick={handleLikeClick} size={"sm"} active={true}
                                                 variant={"secondary"}>{like ? "Unlike" : "Like"}</Button>}
                <section>This Post has {comments.length} comments and {likeAmount} Likes </section>

            </Card.Body>
            {session.isLoggedIn() &&
                <section className={styles.commentSection}>
                    <span className="d-grid gap-2">
                        <Button variant="secondary" size="sm" onClick={handleShowComments}>
                            Comments
                        </Button>
                    </span>
                    {showComments && <Comments model={model} handleEditedComment={handleEditedComment}
                                               handleDeletedComment={handleDeletedComment} handleChange={handleChange}
                                               handleSubmit={handleSubmit} commentList={comments} session={session}
                                               postId={post.id}/>}

                </section>}
            <span
                className={`p-3 text-muted font-monospace small`}>{"Date: " + post.updatedAt.substring(8, 10) + "-" + post.updatedAt.substring(5, 7) + "-" + post.updatedAt.substring(0, 4) + " Time: " + post.createdAt.substring(11, 19)} </span>
        </Card>
    </article>)
}