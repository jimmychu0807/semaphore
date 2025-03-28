/**
 * @module @semaphore-protocol/proof
 * @version 4.9.1
 * @file A library to generate and verify Semaphore proofs.
 * @copyright Ethereum Foundation 2025
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof}
*/
import { program } from 'commander';
import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import '@zk-kit/utils/proof-packing';
import generateProof from './generate-proof.js';
import '@semaphore-protocol/utils/constants';
import '@zk-kit/utils/error-handlers';
import 'snarkjs';
import 'ethers/crypto';
import 'ethers/utils';

program.name("semaphore-proof");
program
    .command("gen-proof")
    .argument("<secret-key>", "Secret Key")
    .argument("<members>", "Members")
    .argument("<scope>", "Scope")
    .argument("<message>", "Message")
    .allowExcessArguments(false)
    .action(async (secretKey, members, scope, message) => {
    if (!secretKey)
        throw new Error("Secret key can't be empty");
    const identity = new Identity(secretKey);
    const proof = await generateProof(identity, new Group(members.split(",")), message, scope);
    console.log(JSON.stringify(proof));
    process.exit(0);
});
program.parseAsync(process.argv)
    .then(() => { })
    .catch((err) => console.error(err));
