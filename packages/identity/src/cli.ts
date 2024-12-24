import { program } from "commander"
import { Identity } from "./index"

program.name("semaphore-identity")

program
    .command("get-public-key")
    .argument("[secret-key]", "Secret Key")
    .allowExcessArguments(false)
    .action(async (secretKey: string) => {
        if (!secretKey) throw new Error("Secret key can't be empty")

        const identity = new Identity(secretKey)
        console.log(`${identity.publicKey[0]} ${identity.publicKey[1]}`)
    })

program.parse(process.argv)
