const path = require('path');
const fs = require('fs-extra');

const finalize = require("./finalize");
const webpack = require("webpack");
const configFactory = require("../webpack.config");

const appDirectory = fs.realpathSync(process.cwd());
const resolve = relativePath => path.resolve(appDirectory, relativePath);
const serverEnv = process.argv.find(a => a.includes("serverenv")).split("=")[1];

const date = new Date();
const buildDirName = `build_${serverEnv}___${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
const renamedBuildDirName = `${buildDirName}_complete`;
const buildDir = resolve(`builds/${buildDirName}`);
const renamedBuildDir = resolve(`builds/${renamedBuildDirName}`);
const outputDir = path.resolve(buildDir, "output");

fs.mkdir(buildDir);

const compiler = webpack(configFactory(serverEnv, outputDir));
compiler.run((err, stats) => {
    finalize.finalize(buildDir, outputDir);
    fs.renameSync(buildDir, renamedBuildDir);
    console.log("Finished at " + (new Date()));
});
