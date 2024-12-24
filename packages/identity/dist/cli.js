/**
 * @module @semaphore-protocol/identity
 * @version 4.8.2
 * @file A library to create Semaphore identities.
 * @copyright Ethereum Foundation 2024
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/identity}
*/
import { program } from 'commander';
import { Identity } from './index.js';

program.name("semaphore-identity");
program
    .command("get-public-key")
    .argument("[secret-key]", "Secret Key")
    .allowExcessArguments(false)
    .action(async (secretKey) => {
    if (!secretKey)
        throw new Error("Secret key can't be empty");
    const identity = new Identity(secretKey);
    console.log(`${identity.publicKey[0]} ${identity.publicKey[1]}`);
});
program.parse(process.argv);
