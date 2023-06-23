import {Button, Form} from "react-bootstrap";
import styles from "../style/CommentForm.module.css"


export default function CommentForm({handleSubmit, handleChange, model}) {

    return (

        <Form onSubmit={handleSubmit} >
            <Form.Group className={`mb-3 ${styles.header}` } controlId="name">
                <Form.Control required onChange={handleChange} name="content" type="text"
                              placeholder="Enter your comment here"
                              value={model.content}/>
                <Button variant={"secondary"} type="submit">submit</Button>
            </Form.Group>
        </Form>
    )
}