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
commander.program
    .command("sign")
    .argument("[secret-key]", "Secret Key")
    .argument("[message]", "Message")
    .allowExcessArguments(false)
    .action(async (secretKey, message) => {
    if (!secretKey || !message) {
        throw new Error("Requires two parameters, `secretKey` and `message` to be filled.");
    }
    const identity = new index.Identity(secretKey);
    const bigIntMsg = BigInt(message);
    const s = identity.signMessage(bigIntMsg);
    console.log(`${s.R8.join(" ")} ${s.S}`);
});
commander.program
    .command("verify")
    .argument("[secret-key]", "Secret Key")
    .argument("[message]", "Message")
    .argument("[signature]", "Signature")
    .allowExcessArguments(false)
    .action(async (secretKey, message, signature) => {
    if (!secretKey || !message || !signature) {
        throw new Error("Requires three parameters, `secretKey` and `message` to be filled.");
    }
    const identity = new index.Identity(secretKey);
    const bigIntMsg = BigInt(message);
    const signArr = signature.split(" ");
    const signObj = {
        R8: [signArr[0], signArr[1]],
        S: signArr[2]
    };
    const res = index.Identity.verifySignature(bigIntMsg, signObj, identity.publicKey);
    console.log(res);
});
commander.program.parse(process.argv);
