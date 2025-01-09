/**
 * @module @semaphore-protocol/proof
 * @version 4.8.2
 * @file A library to generate and verify Semaphore proofs.
 * @copyright Ethereum Foundation 2025
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof}
*/
import { encodeBytes32String } from 'ethers/abi';
import { toBigInt as toBigInt$1 } from 'ethers/utils';

/**
 * Converts a bignumberish or a text to a bigint.
 * @param value The value to be converted to bigint.
 * @return The value converted to bigint.
 */
function toBigInt(value) {
    try {
        return toBigInt$1(value);
    }
    catch (error) {
        if (typeof value === "string") {
            return toBigInt$1(encodeBytes32String(value));
        }
        throw TypeError(error.message);
    }
}

export { toBigInt as default };
