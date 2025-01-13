/**
 * @module @semaphore-protocol/proof
 * @version 4.8.2
 * @file A library to generate and verify Semaphore proofs.
 * @copyright Ethereum Foundation 2025
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof}
*/
'use strict';

var commander = require('commander');
var identity = require('@semaphore-protocol/identity');
var group = require('@semaphore-protocol/group');
require('@zk-kit/utils/proof-packing');
var generateProof = require('./generate-proof.cjs');
require('@semaphore-protocol/utils/constants');
require('@zk-kit/utils/error-handlers');
require('snarkjs');
require('ethers/crypto');
require('ethers/utils');

commander.program.name("semaphore-proof");
commander.program
    .command("gen-proof")
    .argument("[secret-key]", "Secret Key")
    .argument("[members]", "Members")
    .argument("[gid]", "Group Id")
    .argument("[message]", "Message")
    .allowExcessArguments(false)
    .action(async (secretKey, members, gid, message) => {
    if (!secretKey)
        throw new Error("Secret key can't be empty");
    const identity$1 = new identity.Identity(secretKey);
    const proof = await generateProof(identity$1, new group.Group(members.split(",")), message, gid);
    console.log(JSON.stringify(proof));
    process.exit(0);
});
commander.program.parseAsync(process.argv)
    .then(() => { })
    .catch((err) => console.error(err));
