import * as web3 from "@solana/web3.js";
import idl from "../idl.json";

export const SOLANA_FACBOOK_PROGRAM_ID = new web3.PublicKey(
  idl.metadata.address
);
