/**
 * @module @semaphore-protocol/proof
 * @version 4.8.2
 * @file A library to generate and verify Semaphore proofs.
 * @copyright Ethereum Foundation 2025
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof}
*/
'use strict';

var crypto = require('ethers/crypto');
var utils = require('ethers/utils');

/**
 * Creates a keccak256 hash of a message compatible with the SNARK scalar modulus.
 * @param message The message to be hashed.
 * @returns The message digest.
 */
function hash(message) {
    return (BigInt(crypto.keccak256(utils.toBeHex(message, 32))) >> BigInt(8)).toString();
}

module.exports = hash;
