import { program } from "commander"
import { Group } from "./index"

program.name("semaphore-group")

program
    .command("remove-member")
    .argument("<members>", "Members")
    .argument("<removal>", "Removal member")
    .allowExcessArguments(false)
    .action((membersStr: string, removalStr: string) => {
        const members = membersStr.split(",").map(BigInt)
        const group = new Group(members);

        const rmIdx = members.indexOf(BigInt(removalStr));
        if (rmIdx < 0) throw new Error("Removal not found in members");

        group.removeMember(rmIdx);

        const { siblings, root } = group.generateMerkleProof(rmIdx);
        console.log(siblings.join(","), root.toString());
    })

program.parse(process.argv)
