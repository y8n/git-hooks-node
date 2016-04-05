var child_process=require("child_process"),
    spawnSync=child_process.spawnSync;

var result;
// 判断是否是master分支
result=spawnSync("git",["branch","--column"]);
var branchs = result.stdout.toString().split(' ');
var len = branchs.length,branch,currentBranch;
for(var i=0;i<len;i++){
    branch = branchs[i].trim();
    if(branch && branch === '*'){
        currentBranch = branchs[i+1];
        if(currentBranch){
            currentBranch = currentBranch.replace(/(^\n)|(\n$)/g,'')
        }
        break;
    }
}
if(!currentBranch || currentBranch !== 'master'){
    process.exit(0);
}
result=spawnSync("npm",["test"]);
if(result.status){
    console.log(result.stdout.toString());
    console.log('Commit aborted.Test failed.See above for more details');
    process.exit(result.status);
}
