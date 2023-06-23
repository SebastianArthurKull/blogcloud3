import CommentForm from "@components/comments/CommentForm";
import Comment from "@components/comments/Comment";
import {ListGroup} from "react-bootstrap";

export default function Comments({
                                     commentList,
                                     handleEditedComment,
                                     handleDeletedComment,
                                     model,
                                     postId,
                                     session,
                                     handleChange,
                                     handleSubmit
                                 }) {

    return (<ListGroup>
        <ListGroup.Item>
            <CommentForm model={model} handleSubmit={handleSubmit} handleChange={handleChange} postId={postId}
                         session={session}/>
        </ListGroup.Item>
        {commentList.map(comment => {
            return (
                <section key={comment.id}>
                    <Comment comment={comment} postId={postId} session={session}
                         handleEditedComment={handleEditedComment}
                         handleDeletedComment={handleDeletedComment}>

                    </Comment>
                </section>)
        })}
    </ListGroup>)
}