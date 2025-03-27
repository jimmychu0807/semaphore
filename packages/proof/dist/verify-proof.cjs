/**
 * @module @semaphore-protocol/proof
 * @version 4.9.1
 * @file A library to generate and verify Semaphore proofs.
 * @copyright Ethereum Foundation 2025
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof}
*/
'use strict';

var constants = require('@semaphore-protocol/utils/constants');
var errorHandlers = require('@zk-kit/utils/error-handlers');
var proofPacking = require('@zk-kit/utils/proof-packing');
var snarkjs = require('snarkjs');
var hash = require('./hash.cjs');
var verificationKeys = require('./verification-keys.json.cjs');

/**
 * Verifies whether a Semaphore proof is valid. Depending on the depth of the tree used to
 * generate the proof, a different verification key will be used.
 * @param proof The Semaphore proof.
 * @returns True if the proof is valid, false otherwise.
 */
async function verifyProof(proof) {
    errorHandlers.requireDefined(proof, "proof");
    errorHandlers.requireObject(proof, "proof");
    const { merkleTreeDepth, merkleTreeRoot, nullifier, message, scope, points } = proof;
    errorHandlers.requireNumber(merkleTreeDepth, "proof.merkleTreeDepth");
    errorHandlers.requireString(merkleTreeRoot, "proof.merkleTreeRoot");
    errorHandlers.requireString(nullifier, "proof.nullifier");
    errorHandlers.requireString(message, "proof.message");
    errorHandlers.requireString(scope, "proof.scope");
    errorHandlers.requireArray(points, "proof.points");
    if (merkleTreeDepth < constants.MIN_DEPTH || merkleTreeDepth > constants.MAX_DEPTH) {
        throw new TypeError(`The tree depth must be a number between ${constants.MIN_DEPTH} and ${constants.MAX_DEPTH}`);
    }
    const verificationKey = {
        ...verificationKeys.default,
        vk_delta_2: verificationKeys.default.vk_delta_2[merkleTreeDepth - 1],
        IC: verificationKeys.default.IC[merkleTreeDepth - 1]
    };
    return snarkjs.groth16.verify(verificationKey, [merkleTreeRoot, nullifier, hash(message), hash(scope)], proofPacking.unpackGroth16Proof(points));
}

module.exports = verifyProof;
