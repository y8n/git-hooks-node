var fs = require('fs');
var hookType = 'pre-commit',
    hookPath='.git/hooks/'+hookType,
    hookContents='var child_process = require(\'child_process\');\nvar execSync = child_process.execSync;\nvar spawnSync = child_process.spawnSync;\nvar fs = require(\'fs\');\nvar path = require(\'path\');\n\nvar DIFF_COMMAND = \'git diff-index --name-only HEAD\';\n\nvar files, file,\n    root = process.cwd(),\n    file_path,\n    htmlFiles = [],\n    jsFiles = [],\n    isLibFileReg = /^src\\/lib\\/.*/i,\n    isHTMLReg = /^src\\/.*\\.html$/i,\n    isJSReg = /^src\\/.*\\.js$/i,\n    isMinJSReg = /\\.min\\.js$/i;\n\ntry {\n    files = execSync(DIFF_COMMAND).toString().split(\'\\n\');\n    next(0);\n} catch (e) {\n    htmlFiles = [\'.\'];\n    jsFiles = [\'.\'];\n    doLint();\n}\n\nfunction next(i) {\n    if (i >= files.length) {\n        doLint();\n        return;\n    }\n    file = files[i];\n    if (!file) {\n        next(++i);\n        return;\n    }\n    file_path = path.resolve(root, file);\n    if (file.match(isLibFileReg)) {\n        console.log(\'[ERROR] You cannot operate any file in lib directory！！\');\n        quit(1);\n    } else if (fs.existsSync(file_path)) {//进行其他校验，如eslint，htmlhint等。\n        if (file.match(isHTMLReg)) {\n            htmlFiles.push(file_path);\n        }\n        if (file.match(isJSReg) && !file.match(isMinJSReg)) {\n            jsFiles.push(file_path);\n        }\n        next(++i);\n    }\n}\n\nfunction doLint() {\n    var xhtmlhint_bin = \'xhtmlhint\',\n        eslint_bin = \'eslint\',\n        result,\n        errorCode = 0;\n    if (htmlFiles.length) {\n        result = spawnSync(xhtmlhint_bin, htmlFiles);\n        if (result.stdout.length && result.status) {\n            console.log(result.stdout.toString());\n        }\n        errorCode = errorCode || result.status;\n    }\n    if (jsFiles.length) {\n        result = spawnSync(eslint_bin, jsFiles);\n        if (result.stdout.length) {\n            console.log(result.stdout.toString());\n        }\n        errorCode = errorCode || result.status;\n    }\n\n    quit(errorCode);\n}\n\nfunction quit(errorCode) {\n    if (errorCode) {\n        console.log(\'Commit aborted.\');\n    }\n    process.exit(errorCode || 0);\n}\n';

hookContents = '#!/usr/bin/env node\n\n'+hookContents;
fs.writeFile(hookPath,hookContents,{
    mode:'0755'
}, function (err) {
    if(err){
        return console.log('[ERROR]:%s',err);
    }
    console.log('[INFO]:'+hookType+' installed successfully.');
});
