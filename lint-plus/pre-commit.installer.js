var fs = require('fs');
var hookType = 'pre-commit',
    hookPath='.git/hooks/'+hookType,
    hookContents='var child_process=require("child_process"),\n    spawnSync=child_process.spawnSync;\n\nvar result;\n// 判断是否是master分支\nresult=spawnSync("git",["branch","--column"]);\nvar branchs = result.stdout.toString().split(\' \');\nvar len = branchs.length,branch,currentBranch;\nfor(var i=0;i<len;i++){\n    branch = branchs[i].trim();\n    if(branch && branch === \'*\'){\n        currentBranch = branchs[i+1];\n        if(currentBranch){\n            currentBranch = currentBranch.replace(/(^\\n)|(\\n$)/g,\'\')\n        }\n        break;\n    }\n}\nif(!currentBranch || currentBranch !== \'master\'){\n    process.exit(0);\n}\nresult=spawnSync("npm",["test"]);\nif(result.status){\n    console.log(result.stdout.toString());\n    console.log(\'Commit aborted.Test failed.See above for more details\');\n    process.exit(result.status);\n}\n';

hookContents = '#!/usr/bin/env node\n\n'+hookContents;
fs.writeFile(hookPath,hookContents,{
    mode:'0755'
}, function (err) {
    if(err){
        return console.log('[ERROR]:%s',err);
    }
    console.log('[INFO]:'+hookType+' installed successfully.');
});
