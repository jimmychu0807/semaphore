import typescript from "@rollup/plugin-typescript"
import * as fs from "fs"
import cleanup from "rollup-plugin-cleanup"

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"))
const banner = `/**
 * @module ${pkg.name}
 * @version ${pkg.version}
 * @file ${pkg.description}
 * @copyright Ethereum Foundation ${new Date().getFullYear()}
 * @license ${pkg.license}
 * @see [Github]{@link ${pkg.homepage}}
*/`

export default {
    input: ["src/index.ts", "src/cli.ts"],
    output: [
        { dir: "dist", format: "cjs", banner, preserveModules: true, entryFileNames: "[name].cjs" },
        { dir: "dist", format: "es", banner, preserveModules: true },
    ],
    external: [
        ...Object.keys(pkg.dependencies),
        "poseidon-lite/poseidon2",
        "@zk-kit/utils/type-checks",
        "@zk-kit/utils/conversions"
    ],
    plugins: [
        typescript({
            tsconfig: "./build.tsconfig.json"
        }),
        cleanup({ comments: "jsdoc" })
    ]
}
