var fs = require('fs');
var hookType = 'pre-commit',
    hookPath = '.git/hooks/' + hookType,
    hookContents = "var child_process = require(\"child_process\");\nvar execSync = child_process.execSync;\nvar spawnSync = child_process.spawnSync;\nvar path = require('path');\n\nvar fileList = getDiffFiles();\n\nvar srcFiles = fileList.filter(function(file){\n    return isSourceFile(file) ? true : false;\n}).map(function(file){\n    return file.path;\n});\n\nif(srcFiles.length === 0){\n    quit(0);\n}\n\nvar argv = ['lint'];\nargv = argv.concat(srcFiles);\nargv = argv.concat(['-c', './.lintrc']);\nvar result = spawnSync('xg', argv, {stdio: 'inherit'});\nquit(result.status);\n\n/**\n * 获取所有变动的文件,包括增(A)删(D)改(M)重命名(R)复制(C)等\n * @param [type] {string} - 文件变动类型\n * @returns {Array}\n */\nfunction getDiffFiles(type) {\n    var DIFF_COMMAND = 'git diff --cached --name-status HEAD';\n    var root = process.cwd();\n    var files = execSync(DIFF_COMMAND).toString().split('\\n');\n    var result = [];\n    type = type || 'admrc';\n    var types = type.split('').map(function (t) {\n        return t.toLowerCase();\n    });\n    files.forEach(function (file) {\n        if(!file){\n            return;\n        }\n        var temp = file.split(/[\\n\\t]/);\n        var status = temp[0].toLowerCase();\n        var filepath = root+'/'+temp[1];\n        var extName = path.extname(filepath).slice(1);\n\n        if(types.length && ~types.indexOf(status)){\n            result.push({\n                status:status, // 文件变更状态-AMDRC\n                path:filepath, // 文件绝对路径\n                subpath:temp[1], // 文件相对路径\n                extName:extName // 文件后缀名\n            });\n        }\n    });\n    return result;\n};\n\nfunction isSourceFile(file){\n    return /src\\//.test(file.path) && file.extName === 'js'\n}\n\n/**\n * 退出\n * @param errorCode\n */\nfunction quit(errorCode) {\n    if (errorCode) {\n        console.log('Commit aborted.');\n    }\n    process.exit(errorCode || 0);\n}\n";

hookContents = '#!/usr/bin/env node\n\n' + hookContents;
fs.writeFile(hookPath, hookContents, {
    mode: '0755'
}, function (err) {
    if (err) {
        return console.log('[ERROR]:%s', err);
    }
    console.log('[INFO]:' + hookType + ' installed successfully.');
});
