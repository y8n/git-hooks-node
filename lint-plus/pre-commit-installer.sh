#!/bin/sh

output=".git/hooks/pre-commit"
hookContents="var child_process=require(\"child_process\"),spawnSync=child_process.spawnSync,result=spawnSync(\"npm\",[\"test\"]);result.status&&(console.log(result.stdout.toString()),console.log(\"Commit aborted.Test failed.See above for more details\"),process.exit(result.status));"
echo "#!/usr/bin/env node" > ${output}
echo "" >> ${output}
echo ${hookContents} >> ${output}
chmod +x ${output}
echo "pre-commit installed successfully."
