import {Button, Form, Modal, Image} from "react-bootstrap";
import {useEffect, useState} from "react";
import styles from "@components/registerLogin/LoginForm.module.css"
import {useRouter} from "next/router";
import {createPost, updatePost, uploadImage} from "@lib/api";
import ImageUpload from "@components/ImageUpload";

const defaultModel = {
    title: "", content: "", ownerId: "", avatar: []
}

function validateModel(post) {

    const errors = {
        title: "", text: ""
    }

    let isValid = true

    if (post.title.trim().length === 0) {
        isValid = false
        errors.title = "input can't be empty"
    }

    if (post.content.trim().length === 0) {
        isValid = false
        errors.content = "input can't be empty"
    }

    return {errors, isValid}
}

export default function PostForm({edit, show, handleClose, session, postToEdit, handleNewPost}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState(defaultModel)
    const [post, setPost] = useState(defaultModel)
    const [base64Image, setBase64Image] = useState("")
    const [images, setImages] = useState([])
    const [buttonAmount, setButtonAmount] = useState([])


    useEffect(() => {
        if (postToEdit) {
            setPost(postToEdit)

        }
    }, [postToEdit])

    const handleChange = (e) => {
        setPost({...post, [e.target.name]: e.target.value, ownerId: session.user.id})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors(defaultModel)

        const result = validateModel(post)

        if (!result.isValid) {
            setErrors(result.errors)
            setIsLoading(false)
            return
        }

        handleClose()
        let tempData = post
        let list = []
        if (!images.includes("")) {
            for (const image of images) {
                let data = await uploadImage(image, session.accessToken)
                list.push(data.filePath)
            }
            tempData = {...tempData, avatar: list}

        } else {
            tempData = {...tempData, avatar: []}
        }
        tempData = {...tempData, likes: []}

        if (post.id) {
            try {
                tempData.id = post.id
                tempData.updatedAt = new Date().toISOString()
                let newPostReply = await updatePost(tempData, session.accessToken)
                handleNewPost(newPostReply)
                await router.push("/")
            } catch (error) {
                alert(error)
            }
        } else {
            try {
                tempData.createdAt = new Date().toISOString()
                tempData.updatedAt = new Date().toISOString()
                tempData.ownerId = session.user.id
                tempData.likes = []
                let newPostReply = await createPost(tempData, session.accessToken)
                handleNewPost(newPostReply)
                await router.push("/")
            } catch (error) {
                alert(error)
            }
        }
        setBase64Image("")
        setIsLoading(false)
        setImages([])
    }

    const image = (path) => {
        setPost({...post, avatar: path})
    }

    const handleUploadData = (data) => {
        setBase64Image(data)
        setImages([...images, data])
    }

    const handleCloseReset = () => {
        handleClose()
        setBase64Image("")
        setButtonAmount([])
        setImages([])
    }

    const handleButtonAdder = () => {

        setButtonAmount([...buttonAmount, (<div key={buttonAmount.length}>
            <ImageUpload session={session} image={image}
                         uploadData={handleUploadData}></ImageUpload>
        </div>)])

    }
    const handleButtonRemover = () => {
        setButtonAmount(oldList => {
            oldList.pop()
            return [...oldList]
        })
    }

    return (<Modal show={show} onHide={handleCloseReset}>
        <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>{edit ? "Edit" : "Post"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control onChange={handleChange} name="title" type="text" placeholder="Enter title"
                                  value={post.title}/>
                    {errors.title && <Form.Text className={`${styles.error}`}>{errors.title}</Form.Text>}

                </Form.Group>
                {base64Image && <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Image</Form.Label>



                    {images.map((image => {
                        return (
                            <Image key={image} src={image} alt={"Image"} style={{width: "60px", height: "auto"}}/>
                        )
                    }))}

                </Form.Group>}

                <Form.Group className="mb-3" controlId="text">
                    <Form.Label>Text</Form.Label>
                    <Form.Control onChange={handleChange} name="content" type="text" as="textarea" rows={5}
                                  placeholder="Enter text"
                                  value={post.content}/>
                    {errors.content && <Form.Text className={`${styles.error}`}>{errors.content}</Form.Text>}
                </Form.Group>
                <div key={buttonAmount.length}>
                    <ImageUpload session={session} image={image}
                                 uploadData={handleUploadData}></ImageUpload>
                </div>
                {buttonAmount}
                <Button size={"sm"} variant={"outline-success"} onClick={handleButtonAdder}>+</Button>
                <Button size={"sm"} variant={"outline-success"} onClick={handleButtonRemover}>-</Button>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseReset}>
                    Close
                </Button>
                <Button variant="primary" type="submit">
                    {isLoading ? "Loading..." : "Save Changes"}
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>)
}