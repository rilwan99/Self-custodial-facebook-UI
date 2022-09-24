import { FC, useState } from "react";
import { Profile } from "../models/Profile";
import styles from "../styles/Form.module.css"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import * as web3 from "@solana/web3.js"
import bs58 from "bs58";

export const Form: FC = () => {

    const SOLANA_FACBOOK_PROGRAM_ID =
        "8wPQ43NMwLTmxvWNCiqdR8hBd8D3K3JiD6AJuETTNi6P";

    const { publicKey, sendTransaction } = useWallet()
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
        const transaction = new web3.Transaction()
        const [pda, _bump] = await web3.PublicKey.findProgramAddress(
            [Buffer.from("self-custodial-facebook2"), publicKey.toBuffer()],
            new web3.PublicKey(SOLANA_FACBOOK_PROGRAM_ID)
        )

        const buffer = profile.serialize()

        const instruction = new web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            data: buffer,
            programId: new web3.PublicKey(SOLANA_FACBOOK_PROGRAM_ID)
        })

        transaction.add(instruction)
        try {
            let txid = await sendTransaction(transaction, connection)
            alert(
                `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
            )
            console.log(
                `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
            )
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
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