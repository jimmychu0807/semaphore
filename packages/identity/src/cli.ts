import { program } from "commander"
import type { Signature } from "./index"
import { Identity } from "./index"

program.name("semaphore-identity")

program
    .command("get-public-key")
    .argument("[secret-key]", "Secret Key")
    .allowExcessArguments(false)
    .action((secretKey: string) => {
        if (!secretKey) throw new Error("Secret key can't be empty")
        const identity = new Identity(secretKey)
        console.log(`${identity.publicKey[0]} ${identity.publicKey[1]}`)
    })

program
    .command("get-commitment")
    .argument("[secret-key]", "Secret Key")
    .allowExcessArguments(false)
    .action((secretKey: string) => {
        if (!secretKey) throw new Error("Secret key can't be empty")
        const identity = new Identity(secretKey)
        // We want to encode it to hex value because vm.ffi() in foundry read this value as hex-encoded value
        console.log(`${identity.commitment.toString(16)}`)
    })

program
    .command("sign")
    .argument("[secret-key]", "Secret Key")
    .argument("[message]", "Message")
    .allowExcessArguments(false)
    .action((secretKey: string, message: string) => {
        if (!secretKey || !message) {
            throw new Error("Requires two parameters, `secretKey` and `message` to be filled.")
        }
        const identity = new Identity(secretKey)
        const bigIntMsg = BigInt(message)
        const s = identity.signMessage(bigIntMsg)
        console.log(`${s.R8.join(" ")} ${s.S}`)
    })

program
    .command("verify")
    .argument("[public-key]", "Public Key")
    .argument("[message]", "Message")
    .argument("[signature]", "Signature")
    .allowExcessArguments(false)
    .action((publicKey: string, message: string, signature: string) => {
        if (!publicKey || !message || !signature)
            throw new Error("Requires three parameters, `publicKey`, `message`, and `signature` to be filled.")

        // 32 bytes * 2 * 2 + 2 = 130
        if (publicKey.length !== 130) throw new Error("publicKey is not 64-byte long")
        // 32 bytes * 3 * 2 + 2 = 194
        if (signature.length !== 194) throw new Error("publicKey is not 96-byte long")

        const bigIntMsg = BigInt(message)

        // converting public key
        const pkX = BigInt(`0x${publicKey.slice(2, 66)}`)
        const pkY = BigInt(`0x${publicKey.slice(66)}`)

        // converting signature to object
        const s0 = BigInt(`0x${signature.slice(2, 66)}`)
        const s1 = BigInt(`0x${signature.slice(66, 130)}`)
        const s2 = BigInt(`0x${signature.slice(130)}`)

        const signObj: Signature = {
            R8: [s0, s1],
            S: s2
        }
        const res = Identity.verifySignature(bigIntMsg, signObj, [pkX, pkY])
        console.log(res)
    })

program.parse(process.argv)
