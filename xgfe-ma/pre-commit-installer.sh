#!/bin/sh

output=".git/hooks/pre-commit"
hookContents="function next(t){if(t>=files.length)return void doLint();if(file=files[t],!file)return void next(++t);if(sub_path=file.slice(1).trim(),status=file.slice(0,1),file_path=path.resolve(root,sub_path),sub_path.match(isLibFileReg)){if(!status||\"A\"===status||\"C\"===status)return next(++t);console.log(\"[ERROR] You cannot modified/deleted/renamed any file in lib directory！！\"),quit(1)}else fs.existsSync(file_path)&&(sub_path.match(isHTMLReg)&&htmlFiles.push(file_path),sub_path.match(isJSReg)&&!sub_path.match(isMinJSReg)&&jsFiles.push(file_path),next(++t))}function doLint(){var t,s=\"xhtmlhint\",e=\"eslint\",i=0;htmlFiles.length&&(t=spawnSync(s,htmlFiles),t.stdout.length&&t.status&&console.log(t.stdout.toString()),i=i||t.status),jsFiles.length&&(t=spawnSync(e,jsFiles),t.stdout.length&&console.log(t.stdout.toString()),i=i||t.status),quit(i)}function quit(t){t&&console.log(\"Commit aborted.\"),process.exit(t||0)}var child_process=require(\"child_process\"),execSync=child_process.execSync,spawnSync=child_process.spawnSync,fs=require(\"fs\"),path=require(\"path\"),DIFF_COMMAND=\"git diff --name-status\",files,file,root=process.cwd(),file_path,sub_path,status,htmlFiles=[],jsFiles=[],isLibFileReg=/^src\/lib\/.*/i,isHTMLReg=/^src\/.*\.html$/i,isJSReg=/^src\/.*\.js$/i,isMinJSReg=/\.min\.js$/i;files=execSync(DIFF_COMMAND).toString().split(\"\n\"),next(0);"
echo "#!/usr/bin/env node" > ${output}
echo "" >> ${output}
echo ${hookContents} >> ${output}
chmod +x ${output}
echo "pre-commit installed successfully."
