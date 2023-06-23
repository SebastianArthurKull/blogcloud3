import LoginForm from "@components/registerLogin/LoginForm";
import RegisterForm from "@components/registerLogin/RegisterForm";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Button, Container, Image, Nav, Navbar} from "react-bootstrap";
import styles from "./style/Header.module.css"


export default function Header({session}) {
    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter()
    const [showRegistration, setShowRegistration] = useState(false)
    const [user, setUser] = useState()

    const handleClose = () => setShowLogin(false);
    const handleCloseReg = () => setShowRegistration(false);
    const handleRegistration = () => setShowRegistration(true);

    const handleShow = async () => {
        if (!session.isLoggedIn()) {
            setShowLogin(true);
        } else {
            await router.push("profile")
            await router.push(`users/${session.user.id}/`)
        }
    }

    useEffect(() => {
        if (session) {
            setUser(session.user)
        }
    }, [session])

    return (<Navbar className={styles.navbar}>
            <Container>
                <Navbar.Brand href="#home"></Navbar.Brand>
                <Nav className="me-auto">
                    <Image className={styles.image} src={session.isLoggedIn() ? (session.user.avatar) : "/0.png"}
                           alt={"Profile Picture"}
                           rounded={true} onClick={handleShow} height={100}/>
                    {user && <h3 className={styles.title}>{user.name}</h3>}
                </Nav>
                <Image className={styles.image2} src={"/resources/LogoBigFat.png"} alt={"Logo"} width={400
                }/>
                {session.isLoggedIn() &&
                    <Button className="alert-secondary" onClick={() => session.logout()}>Logout</Button>}
                {!session.isLoggedIn() && <Button className="alert-secondary" onClick={handleShow}>Login</Button>}
            </Container>
            <LoginForm session={session} show={showLogin} handleClose={handleClose}
                       handleRegistration={handleRegistration}/>
            <RegisterForm show={showRegistration} handleClose={handleCloseReg}></RegisterForm>
        </Navbar>
    )
}