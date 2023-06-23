import {Container, Nav, Navbar} from "react-bootstrap";
import Searchbar from "./searchbar/Searchbar";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import styles from "./style/Footer.module.css"

export default function Footer({session, query, handleChange}) {
    const router = useRouter()
    const path = router.pathname
    const [searchable, setSearchable] = useState(false)

    useEffect(() => {
        if (path === "/" || path.includes("/users")){
            setSearchable(true)
        }
    }, [path])

    return (
        <Navbar bg="light" expand="lg" className={`fixed-bottom ${styles.navbar}`}>
            <Container >
                <Navbar.Brand href="/">
                    Blogcloud
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/users">Users</Nav.Link>
                        <Nav.Link href="/impressum">Impressum</Nav.Link>
                        {session.isLoggedIn() && <Nav.Link href="/profile">Edit Profile</Nav.Link>}
                        {searchable&& <Searchbar query={ query } onChange={ handleChange }/>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}