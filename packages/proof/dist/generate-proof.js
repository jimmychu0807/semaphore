/**
 * @module @semaphore-protocol/proof
 * @version 4.8.2
 * @file A library to generate and verify Semaphore proofs.
 * @copyright Ethereum Foundation 2025
 * @license MIT
 * @see [Github]{@link https://github.com/semaphore-protocol/semaphore/tree/main/packages/proof}
*/
import { MIN_DEPTH, MAX_DEPTH } from '@semaphore-protocol/utils/constants';
import { maybeGetSnarkArtifacts, Project } from '@zk-kit/artifacts';
import { requireDefined, requireObject, requireTypes, requireNumber } from '@zk-kit/utils/error-handlers';
import { packGroth16Proof } from '@zk-kit/utils/proof-packing';
import { groth16 } from 'snarkjs';
import hash from './hash.js';
import toBigInt from './to-bigint.js';

/**
 * It generates a Semaphore proof, i.e. a zero-knowledge proof that an identity that
 * is part of a group has shared an anonymous message.
 * The message may be any arbitrary user-defined value (e.g. a vote), or the hash of that value.
 * The scope is a value used like a topic on which users can generate a valid proof only once,
 * for example the id of an election in which voters can only vote once.
 * The hash of the identity's scope and secret scalar is called a nullifier and can be
 * used to verify whether that identity has already generated a valid proof in that scope.
 * The depth of the tree determines which zero-knowledge artifacts to use to generate the proof.
 * If it is not defined, it will be inferred from the group or Merkle proof passed as the second parameter.
 * Finally, the artifacts themselves can be passed manually with file paths,
 * or they will be automatically fetched.
 * Please keep in mind that groups with 1 member or 2 members cannot be considered anonymous.
 * @param identity The Semaphore identity.
 * @param groupOrMerkleProof The Semaphore group or its Merkle proof.
 * @param message The Semaphore message.
 * @param scope The Semaphore scope.
 * @param merkleTreeDepth The depth of the tree with which the circuit was compiled.
 * @param snarkArtifacts See {@link https://zkkit.pse.dev/interfaces/_zk_kit_utils.SnarkArtifacts.html | SnarkArtifacts}.
 * @returns The Semaphore proof ready to be verified.
 */
async function generateProof(identity, groupOrMerkleProof, message, scope, merkleTreeDepth, snarkArtifacts) {
    requireDefined(identity, "identity");
    requireDefined(groupOrMerkleProof, "groupOrMerkleProof");
    requireDefined(message, "message");
    requireDefined(scope, "scope");
    requireObject(identity, "identity");
    requireObject(groupOrMerkleProof, "groupOrMerkleProof");
    requireTypes(message, "message", ["string", "bigint", "number", "Uint8Array"]);
    requireTypes(scope, "scope", ["string", "bigint", "number", "Uint8Array"]);
    if (merkleTreeDepth) {
        requireNumber(merkleTreeDepth, "merkleTreeDepth");
    }
    if (snarkArtifacts) {
        requireObject(snarkArtifacts, "snarkArtifacts");
    }
    // Message and scope can be strings, numbers or buffers (i.e. Uint8Array).
    // They will be converted to bigints anyway.
    message = toBigInt(message);
    scope = toBigInt(scope);
    let merkleProof;
    // The second parameter can be either a Merkle proof or a group.
    // If it is a group the Merkle proof will be calculated here.
    if ("siblings" in groupOrMerkleProof) {
        merkleProof = groupOrMerkleProof;
    }
    else {
        const leafIndex = groupOrMerkleProof.indexOf(identity.commitment);
        merkleProof = groupOrMerkleProof.generateMerkleProof(leafIndex);
    }
    const merkleProofLength = merkleProof.siblings.length;
    if (merkleTreeDepth !== undefined) {
        if (merkleTreeDepth < MIN_DEPTH || merkleTreeDepth > MAX_DEPTH) {
            throw new TypeError(`The tree depth must be a number between ${MIN_DEPTH} and ${MAX_DEPTH}`);
        }
    }
    else {
        merkleTreeDepth = merkleProofLength !== 0 ? merkleProofLength : 1;
    }
    // If the Snark artifacts are not defined they will be automatically downloaded.
    snarkArtifacts ?? (snarkArtifacts = await maybeGetSnarkArtifacts(Project.SEMAPHORE, {
        parameters: [merkleTreeDepth],
        version: "4.0.0"
    }));
    const { wasm, zkey } = snarkArtifacts;
    // The index must be converted to a list of indices, 1 for each tree level.
    // The missing siblings can be set to 0, as they won't be used in the circuit.
    const merkleProofIndices = [];
    const merkleProofSiblings = merkleProof.siblings;
    for (let i = 0; i < merkleTreeDepth; i += 1) {
        merkleProofIndices.push((merkleProof.index >> i) & 1);
        if (merkleProofSiblings[i] === undefined) {
            merkleProofSiblings[i] = 0n;
        }
    }
    const { proof, publicSignals } = await groth16.fullProve({
        secret: identity.secretScalar,
        merkleProofLength,
        merkleProofIndices,
        merkleProofSiblings,
        scope: hash(scope),
        message: hash(message)
    }, wasm, zkey);
    return {
        merkleTreeDepth,
        merkleTreeRoot: merkleProof.root.toString(),
        nullifier: publicSignals[1],
        message: message.toString(),
        scope: scope.toString(),
        points: packGroth16Proof(proof)
    };
}

export { generateProof as default };
