import bs58 from "bs58";
import * as web3 from "@solana/web3.js";
import { Profile } from "../models/Profile";

const SOLANA_FACBOOK_PROGRAM_ID =
  "8wPQ43NMwLTmxvWNCiqdR8hBd8D3K3JiD6AJuETTNi6P";

export class ProfileCoordinator {
  static accounts: web3.PublicKey[] = [];

  static async prefetchAccounts(connection: web3.Connection) {
    // Fetch all PDA accounts owned by our program (profiles)
    const accounts = await connection.getProgramAccounts(
      new web3.PublicKey(SOLANA_FACBOOK_PROGRAM_ID)
    );
    this.accounts = accounts.map((account) => account.pubkey);
    console.log("Profile PDA Accounts-------");
    this.accounts.forEach((account) => console.log(account.toString()));
  }

  static async fetchPage(connection: web3.Connection): Promise<Profile[]> {
    if (this.accounts.length === 0) {
      await this.prefetchAccounts(connection);
    }

    const accounts = await connection.getMultipleAccountsInfo(this.accounts);
    const profiles = accounts.reduce((accum: Profile[], account) => {
      const profile = Profile.deserialize(account?.data);
      if (!profile) {
        return accum;
      }
      return [...accum, profile];
    }, []);
    return profiles;
  }
}
