/**
 * @module @semaphore-protocol/proof
 * @version 4.9.1
 * @file A library to generate and verify Semaphore proofs.
 * @copyright Ethereum Foundation 2025
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof}
*/
'use strict';

var proofPacking = require('@zk-kit/utils/proof-packing');
var generateProof = require('./generate-proof.cjs');
var verifyProof = require('./verify-proof.cjs');



Object.defineProperty(exports, "packGroth16Proof", {
	enumerable: true,
	get: function () { return proofPacking.packGroth16Proof; }
});
Object.defineProperty(exports, "unpackGroth16Proof", {
	enumerable: true,
	get: function () { return proofPacking.unpackGroth16Proof; }
});
exports.generateProof = generateProof;
exports.verifyProof = verifyProof;
