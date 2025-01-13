/**
 * @module @semaphore-protocol/proof
 * @version 4.8.2
 * @file A library to generate and verify Semaphore proofs.
 * @copyright Ethereum Foundation 2025
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof}
*/
'use strict';

var abi = require('ethers/abi');
var utils = require('ethers/utils');

/**
 * Converts a bignumberish or a text to a bigint.
 * @param value The value to be converted to bigint.
 * @return The value converted to bigint.
 */
function toBigInt(value) {
    try {
        return utils.toBigInt(value);
    }
    catch (error) {
        if (typeof value === "string") {
            return utils.toBigInt(abi.encodeBytes32String(value));
        }
        throw TypeError(error.message);
    }
}

module.exports = toBigInt;
