import {Card} from "react-bootstrap";
import Link from "next/link";

export default function impressumPage() {

    return (
    <article>
        <h1 >Impressum</h1>
        <Card  border="dark" style={{width: '100%'}}>
            <Card.Body>
                <Card.Title > Contact us :</Card.Title>
                <Card.Text>
                    <Link href="https://berufsbildungscenter.ch/kontakt/"> Bbc Bern </Link>
                </Card.Text>
                <Card.Title >Publisher</Card.Title>
                <ul>
                    <li>ICT Berufsbildungscenter AG</li>
                    <li>Bahnhöheweg 70</li>
                    <li>3018 Bern</li>
                </ul>
                <Card.Title>Quick annotation: </Card.Title>
                <Card.Text>This Website was created in form of an school-project.</Card.Text>
            </Card.Body>
        </Card>
    </article>

    )
}