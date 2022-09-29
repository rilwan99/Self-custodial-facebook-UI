import { FC, useState } from "react";
import { Profile } from "../models/Profile";
import styles from "../styles/Card.module.css"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { AnchorProvider, Idl, Program, web3 } from "@project-serum/anchor";
import { SOLANA_FACBOOK_PROGRAM_ID } from "../utils/constants";
import idl from '../../../target/idl/self_custodial_facebook.json';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';



export interface ProfileProps {
    profile: Profile
}

export const Card: FC<ProfileProps> = (props) => {

    const wallet = useAnchorWallet()
    const publicKey = wallet?.publicKey
    const { connection } = useConnection()
    const [newStatus, setNewStatus] = useState("")


    const handleDelete = (event: any) => {
        event.preventDefault()
        handleTransactionDelete()
    }

    const handleUpdate = (event: any) => {
        event.preventDefault()
        handleTransactionUpdate()
    }

    const handleTransactionDelete = async () => {
        if (!publicKey) {
            alert("Please connect your wallet")
            return
        }
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
        const program = new Program(idl as Idl, SOLANA_FACBOOK_PROGRAM_ID, provider)
        try {
            const ix = await program.methods.deleteAccount()
            const tx = await ix.rpc()
            console.log("TXN submitted Successfully-------", tx)
            alert("Transaction submitted: " + tx)
        } catch (err) {
            console.log("Transaction error, ", err)
        }
    }

    const handleTransactionUpdate = async () => {
        console.log("Changing status to:: " + newStatus)

        if (!publicKey) {
            alert("Please connect your wallet")
            return
        }
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
        const program = new Program(idl as Idl, SOLANA_FACBOOK_PROGRAM_ID, provider)
        try {
            const ix = await program.methods.updateStatus(newStatus)
            const tx = await ix.rpc()
            console.log("TXN submitted Successfully-------", tx)
            alert("Transaction submitted: " + tx)
        } catch (err) {
            console.log("Transaction error, ", err)
        }
    }


    return (
        <div className={styles.card}>
            <div className={styles.deleteButton}>
                <button onClick={handleDelete}>
                    <DeleteOutlined sx={{ color: "#ff0000" }} />
                </button>
            </div>

            <h2>Name: {props.profile.name}</h2>
            <p>Status: {props.profile.status}</p>
            <p>Twitter: {props.profile.twitter}</p>
            <input placeholder="new status" className={styles.input} onChange={(event) => setNewStatus(event.currentTarget.value)}></input>
            <button className={styles.button} onClick={handleUpdate} >Update Account</button>
        </div>
    )
}