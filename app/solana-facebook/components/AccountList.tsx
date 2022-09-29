import { FC } from "react";
import { web3 } from '@project-serum/anchor'
import { Profile } from '../models/Profile'
import { useEffect, useState } from 'react'
import { ProfileCoordinator } from '../coordinators/ProfileCoordinator'
import { Card } from '../components/Card'
import styles from "../styles/Home.module.css"


export const AccountList: FC = () => {

    // let profileList: Profile[];
    // profileList = Profile.mocks;
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [profileList, setProfileList] = useState<Profile[]>([]);

    useEffect(() => {
        ProfileCoordinator.fetchPage(connection).then(setProfileList)
    }, [])

    return (
        <div className={styles.grid}>
            {profileList.map((profile, i) => <Card key={i} profile={profile} />)}
        </div>
    )
}