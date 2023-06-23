import {Image, ListGroup, Card, Button} from "react-bootstrap";
import {useRouter} from "next/router";
import styles from "./style/User.module.css"


export default function User({user, handleFollow, session}) {
    const router = useRouter()

    return <div className={styles.boarder}>
        <Card.Header><Image className={styles.image} onClick={async () => await router.push(`/users/${user.id}/`)}
                            src={user.avatar} alt={"Profile Picture"} rounded={true} height={200}/></Card.Header>
        <ListGroup variant="flush">
            <ListGroup.Item style={{fontWeight: "bold"}}>{user.name} <br/>

                {user && session.isLoggedIn() && (user.id !== session.user.id) &&
                    <Button variant={"secondary"} size={"sm"} onClick={() => handleFollow(user)}>
                        {!session.user.follows.includes(user.id) ? "Follow" : "Unfollow"}
                    </Button>}
            </ListGroup.Item>
            <ListGroup.Item style={{blockSize: "auto"}}>
                <div style={{fontStyle: "oblique"}}>Biography</div>
                {user.bio}</ListGroup.Item>
        </ListGroup>
    </div>
}