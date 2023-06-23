import Header from "@components/Header"
import useSession from "@lib/session"
import "./styles/_app.css"
import Footer from "@components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from "react";
import colors from "@components/style/Colors.module.css";
import "./styles/_app.css";

export default function App({Component, pageProps}) {
    const [query, setQuery] = useState("")
    const handleChange = (event) => {
        setQuery(event.target.value)
    }

    const session = useSession()
    const newPageProps = {
        ...pageProps,
        session,
        query
    }

    if(!session.ready) return <div></div>

    return (<>

        <Header session={session} >
        </Header>

        <section className={`${colors.background} mb-5`}>
            <Component {...newPageProps} />
        </section>

        <Footer session={session} query={query} handleChange={handleChange}>
            test
        </Footer>
    </>)
}