import { program } from "commander"
import { Identity } from "@semaphore-protocol/identity"
import { Group } from "@semaphore-protocol/group"

import type { SemaphoreProof } from "./types"
import { generateProof } from "./index"

program.name("semaphore-proof")

program
    .command("gen-proof")
    .argument("<secret-key>", "Secret Key")
    .argument("<members>", "Members")
    .argument("<scope>", "Scope")
    .argument("<message>", "Message")
    .allowExcessArguments(false)
    .action(async (secretKey: string, members: string, scope: bigint | Uint8Array | string, message: bigint | Uint8Array | string) => {
        if (!secretKey) throw new Error("Secret key can't be empty")
        const identity = new Identity(secretKey)

        const proof: SemaphoreProof = await generateProof(identity, new Group(members.split(",")), message, scope)
        console.log(JSON.stringify(proof))
        process.exit(0)
    })

program.parseAsync(process.argv)
    .then(() => {})
    .catch((err) => console.error(err))
