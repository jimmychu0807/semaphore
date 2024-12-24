/**
 * @module @semaphore-protocol/identity
 * @version 4.8.2
 * @file A library to create Semaphore identities.
 * @copyright Ethereum Foundation 2024
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/identity}
*/
'use strict';

var commander = require('commander');
var index = require('./index.cjs');

commander.program.name("semaphore-identity");
commander.program
    .command("get-public-key")
    .argument("[secret-key]", "Secret Key")
    .allowExcessArguments(false)
    .action(async (secretKey) => {
    if (!secretKey)
        throw new Error("Secret key can't be empty");
    const identity = new index.Identity(secretKey);
    console.log(`${identity.publicKey[0]} ${identity.publicKey[1]}`);
});
commander.program.parse(process.argv);
