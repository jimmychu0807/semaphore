/**
 * @module @semaphore-protocol/group
 * @version 4.9.1
 * @file A library to create and manage Semaphore groups.
 * @copyright Ethereum Foundation 2025
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/group}
*/
'use strict';

var commander = require('commander');
var index = require('./index.cjs');

commander.program.name("semaphore-group");
commander.program
    .command("remove-member")
    .argument("<members>", "Members")
    .argument("<removal>", "Removal member")
    .allowExcessArguments(false)
    .action((membersStr, removalStr) => {
    const members = membersStr.split(",").map(BigInt);
    const group = new index.Group(members);
    const rmIdx = members.indexOf(BigInt(removalStr));
    if (rmIdx < 0)
        throw new Error("Removal not found in members");
    group.removeMember(rmIdx);
    const { siblings, root } = group.generateMerkleProof(rmIdx);
    console.log(siblings.join(","), root.toString());
});
commander.program.parse(process.argv);
