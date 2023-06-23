import {Accordion, Button, Form, Image} from "react-bootstrap";
import styles from "@components/registerLogin/LoginForm.module.css";
import {useEffect, useState} from "react";
import {updateUser, uploadImage} from "@lib/api";
import {useRedirectToLogin} from "@lib/session";
import ImageUpload from "@components/ImageUpload";

const defaultModel = {
    email: "", name: "", id: 0
}

export default function Profile({session}) {
    const [user, setUser] = useState(defaultModel)
    const [error, setError] = useState("")
    const [base64Image, setBase64Image] = useState("")

    useRedirectToLogin(session)




    //Building Users Data
    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    useEffect(() => {
        if (session.user) {
            setUser({email: session.user.email, name: session.user.name, id: session.user.id, bio: session.user.bio})
        }
    }, [session])

    const handleSubmit = async (e) => {

        let tempUser = user

        e.preventDefault()
        if (base64Image) {
            const data = await uploadImage(base64Image, session.accessToken)
            tempUser = {...tempUser, avatar: data.filePath}
        }
        try {
            const resp = await updateUser(tempUser, session.accessToken)

            session.updateSessionUser({name: resp.name, email: resp.email, avatar: resp.avatar, bio: resp.bio, follows: resp.follows})
        } catch (error) {
            console.log(error)
            setError("error, something went wrong")
        }
    }

    const image = (path) => {
        setUser({...user, avatar: path})
    }

    const handleUploadData = (data) => {
        setBase64Image(data)
    }

    return (<>

        <Accordion>

            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    {session.isLoggedIn() &&
                        <Image src={base64Image===""? session.user.avatar : base64Image} alt={"Profile Picture"} rounded={true} height={100}/>}
                    Change your Profile Picture
                </Accordion.Header>
                <Accordion.Body>
                    <ImageUpload session={session} image={image} uploadData={handleUploadData}></ImageUpload>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
                <Accordion.Header>{user.name}</Accordion.Header>
                <Accordion.Body>
                    change your username
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Control required onChange={handleChange} name="name" type="text"
                                      value={user.name}/>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
                <Accordion.Header>{user.email}</Accordion.Header>
                <Accordion.Body>
                    change your email
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Control required onChange={handleChange} name="email" type="email"
                                      value={user.email}/>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
                <Accordion.Header>Password</Accordion.Header>
                <Accordion.Body>
                    change your password
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Control required onChange={handleChange} name="password" type="password"
                                      placeholder={"°°°°°°°°°°"}
                                      value={user.password ? user.password : ""}/>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
                <Accordion.Header>Write something about you</Accordion.Header>
                <Accordion.Body>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Control required onChange={handleChange} name="bio"
                                      type="text" as="textarea" rows={4}
                                      value={user.bio ? user.bio : ""}/>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Accordion.Body>
            </Accordion.Item>

            <Button variant="primary" type="submit" onClick={handleSubmit}>
                Save Changes
            </Button>

        </Accordion>
    </>)
}