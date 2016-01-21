#!/bin/sh

output=".git/hooks/pre-commit"
hookContents="function next(e){return e>=files.length?void doLint():(file=files[e])?(file_path=path.resolve(root,file),void(file.match(isLibFileReg)?(console.log(\"[ERROR] You cannot operate any file in lib directory！！\"),quit(1)):fs.existsSync(file_path)&&(file.match(isHTMLReg)&&htmlFiles.push(file_path),file.match(isJSReg)&&!file.match(isMinJSReg)&&jsFiles.push(file_path),next(++e)))):void next(++e)}function doLint(){var e,i=\"xhtmlhint\",t=\"eslint\",s=0;htmlFiles.length&&(e=spawnSync(i,htmlFiles),e.stdout.length&&e.status&&console.log(e.stdout.toString()),s=s||e.status),jsFiles.length&&(e=spawnSync(t,jsFiles),e.stdout.length&&console.log(e.stdout.toString()),s=s||e.status),quit(s)}function quit(e){e&&console.log(\"Commit aborted.\"),process.exit(e||0)}var child_process=require(\"child_process\"),execSync=child_process.execSync,spawnSync=child_process.spawnSync,fs=require(\"fs\"),path=require(\"path\"),DIFF_COMMAND=\"git diff-index --name-only HEAD\",files,file,root=process.cwd(),file_path,htmlFiles=[],jsFiles=[],isLibFileReg=/^src\/lib\/.*/i,isHTMLReg=/^src\/.*\.html$/i,isJSReg=/^src\/.*\.js$/i,isMinJSReg=/\.min\.js$/i;try{files=execSync(DIFF_COMMAND).toString().split(\"\n\"),next(0)}catch(e){htmlFiles=[\".\"],jsFiles=[\".\"],doLint()}"
echo "#!/usr/bin/env node" > ${output}
echo "" >> ${output}
echo ${hookContents} >> ${output}
chmod +x ${output}
echo "pre-commit installed successfully."
