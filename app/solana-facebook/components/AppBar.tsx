import { FC } from "react";
import styles from "../styles/Appbar.module.css"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'


export const AppBar: FC = () => {
    return (


        <div className={styles.AppHeader}>
            <Image src="/logo.svg" height={30} width={200} />
            <h2 className={styles.title}>
                Welcome to <a href="https://www.facebook.com/">Facebook</a> built on Solana
            </h2>
            <WalletMultiButton />
        </div>
    )
}