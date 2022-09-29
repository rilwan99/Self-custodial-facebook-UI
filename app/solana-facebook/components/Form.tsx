import { FC, useState } from "react";
import { Profile } from "../models/Profile";
import styles from "../styles/Form.module.css"
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import * as web3 from "@solana/web3.js"
import bs58 from "bs58";
import { SOLANA_FACBOOK_PROGRAM_ID } from "../utils/constants";
import { AnchorProvider, getProvider, Idl, Program } from "@project-serum/anchor";
import idl from '../../../target/idl/self_custodial_facebook.json';
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

export const Form: FC = () => {

    const wallet = useAnchorWallet()
    const publicKey = wallet?.publicKey
    const { connection } = useConnection()

    const [name, setName] = useState("")
    const [status, setStatus] = useState("")
    const [twitter, setTwitter] = useState("")

    const handleSubmit = (event: any) => {
        event.preventDefault()
        const profile = new Profile(name, status, twitter)
        handleTransactionSubmit(profile)
    }

    const handleTransactionSubmit = async (profile: Profile) => {
        if (!publicKey) {
            alert("Please connect your wallet")
            return
        }
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
        const program = new Program(idl as Idl, SOLANA_FACBOOK_PROGRAM_ID, provider)
        try {
            const ix = await program.methods.createFacebook(
                profile.name,
                profile.status,
                profile.twitter,
            )
            const tx = await ix.rpc()
            console.log("TXN submitted Successfully-------", tx)
            alert("Transaction submitted: " + tx)
        } catch (err) {
            console.log("Transaction error, ", err)
        }

    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <p>Name: </p> <input id="profileName" className={styles.input} onChange={(event) => setName(event.currentTarget.value)}></input>
            <p>Status: </p> <input id="profileStatus" className={styles.input} onChange={(event) => setStatus(event.currentTarget.value)}></input>
            <p>Twitter: </p> <input id="profilTwitter" className={styles.input} onChange={(event) => setTwitter(event.currentTarget.value)}></input>
            <button className={styles.button}>Create Account</button>
        </form>
    )
}