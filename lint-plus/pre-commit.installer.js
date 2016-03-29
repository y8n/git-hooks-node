var fs = require('fs');
var hookType = 'pre-commit',
    hookPath='.git/hooks/'+hookType,
    hookContents='var child_process=require("child_process"),\n    spawnSync=child_process.spawnSync;\n\nvar result=spawnSync("npm",["test"]);\nif(result.status){\n    console.log(result.stdout.toString());\n    console.log(\'Commit aborted.Test failed.See above for more details\');\n    process.exit(result.status);\n}';

hookContents = '#!/usr/bin/env node\n\n'+hookContents;
fs.writeFile(hookPath,hookContents,{
    mode:'0755'
}, function (err) {
    if(err){
        return console.log('[ERROR]:%s',err);
    }
    console.log('[INFO]:'+hookType+' installed successfully.');
});
