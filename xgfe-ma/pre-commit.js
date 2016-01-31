var child_process = require('child_process');
var execSync = child_process.execSync;
var spawnSync = child_process.spawnSync;
var fs = require('fs');
var path = require('path');

var DIFF_COMMAND = 'git diff-index --name-only HEAD';

var files, file,
    root = process.cwd(),
    file_path,
    htmlFiles = [],
    jsFiles = [],
    isLibFileReg = /^src\/lib\/.*/i,
    isHTMLReg = /^src\/.*\.html$/i,
    isJSReg = /^src\/.*\.js$/i,
    isMinJSReg = /\.min\.js$/i;

try {
    files = execSync(DIFF_COMMAND).toString().split('\n');
    next(0);
} catch (e) {
    htmlFiles = ['.'];
    jsFiles = ['.'];
    doLint();
}

function next(i) {
    if (i >= files.length) {
        doLint();
        return;
    }
    file = files[i];
    if (!file) {
        next(++i);
        return;
    }
    file_path = path.resolve(root, file);
    if (file.match(isLibFileReg)) {
        console.log('[ERROR] You cannot operate any file in lib directory！！');
        quit(1);
    } else if (fs.existsSync(file_path)) {//进行其他校验，如eslint，htmlhint等。
        if (file.match(isHTMLReg)) {
            htmlFiles.push(file_path);
        }
        if (file.match(isJSReg) && !file.match(isMinJSReg)) {
            jsFiles.push(file_path);
        }
        next(++i);
    }
}

function doLint() {
    var xhtmlhint_bin = 'xhtmlhint',
        eslint_bin = 'eslint',
        result,
        errorCode = 0;
    if (htmlFiles.length) {
        result = spawnSync(xhtmlhint_bin, htmlFiles);
        if (result.stdout.length && result.status) {
            console.log(result.stdout.toString());
        }
        errorCode = errorCode || result.status;
    }
    if (jsFiles.length) {
        result = spawnSync(eslint_bin, jsFiles);
        if (result.stdout.length) {
            console.log(result.stdout.toString());
        }
        errorCode = errorCode || result.status;
    }

    quit(errorCode);
}

function quit(errorCode) {
    if (errorCode) {
        console.log('Commit aborted.');
    }
    process.exit(errorCode || 0);
}
