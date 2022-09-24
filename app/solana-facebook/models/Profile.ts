import * as borsh from "@project-serum/borsh";
import { PublicKey } from "@solana/web3.js";

export class Profile {
  name: string;
  status: string;
  twitter: string;

  constructor(name: string, status: string, twitter: string) {
    this.name = name;
    this.status = status;
    this.twitter = twitter;
  }

  static mocks: Profile[] = [
    new Profile("Anatoly_Yakovenko", "Building the greatest L1", "@0xToly"),
    new Profile("Zachxbt", "Cathing blockchain thieves", "@zachxbt"),
    new Profile("Do Kwon", "On the Run", "@thegreatkwon"),
  ];

  borshInstructionSchema = borsh.struct([
    borsh.str("name"),
    borsh.str("status"),
    borsh.str("twitter"),
  ]);

  static testSchema = borsh.struct([
    borsh.str("name"),
    borsh.str("status"),
    borsh.str("twitter"),
  ]);

  static borshProfileSchema = borsh.struct([
    borsh.publicKey("authority"),
    borsh.u8("bump"),
    borsh.str("name"),
    borsh.str("status"),
    borsh.str("twitter"),
  ]);

  serialize(): Buffer {
    const buffer = Buffer.alloc(1000);
    this.borshInstructionSchema.encode({ ...this }, buffer);
    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer));
  }

  static deserialize(buffer?: Buffer): Profile | null {
    if (!buffer) {
      return null;
    }
    try {
      const { name, status, twitter } = this.borshProfileSchema.decode(
        buffer,
        8
      );
      return new Profile(name, status, twitter);
    } catch (e) {
      console.log("Deserializarion Error: ", e);
      return null;
    }
  }
}
