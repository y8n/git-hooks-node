var child_process=require("child_process"),
    spawnSync=child_process.spawnSync;

var result=spawnSync("npm",["test"]);
if(result.status){
    console.log(result.stdout.toString());
    console.log('Commit aborted.Test failed.See above for more details');
    process.exit(result.status);
}