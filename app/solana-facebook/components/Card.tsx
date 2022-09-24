import { FC } from "react";
import { Profile } from "../models/Profile";
import styles from "../styles/Card.module.css"

export interface ProfileProps {
    profile: Profile
}

export const Card: FC<ProfileProps> = (props) => {
    return (
        <div className={styles.card}>
            <h2>Name: {props.profile.name}</h2>
            <p>Status: {props.profile.status}</p>
            <p>Twitter: {props.profile.twitter}</p>
        </div>
    )
}