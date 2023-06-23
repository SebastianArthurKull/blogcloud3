import Profile from "@components/Profile";
import styles from "pages/styles/pages.module.css"
import {useRedirectToHomeWhenNotLoggedIn} from "@lib/session";

export default function ProfilePage({session}){
    useRedirectToHomeWhenNotLoggedIn(session)

    return (
        <>
            <h2 className={styles.impress}>Edit your Profile</h2>
            <Profile session={session}></Profile>

        </>
    )
}