var child_process = require('child_process');
var execSync = child_process.execSync;
var spawnSync = child_process.spawnSync;
var fs = require('fs');
var path = require('path');

var DIFF_COMMAND = 'git diff --name-status';

var files, file,
    root = process.cwd(),
    file_path,
    sub_path,status,
    htmlFiles = [],
    jsFiles = [],
    isLibFileReg = /^src\/lib\/.*/i,
    isHTMLReg = /^src\/.*\.html$/i,
    isJSReg = /^src\/.*\.js$/i,
    isMinJSReg = /\.min\.js$/i;


files = execSync(DIFF_COMMAND).toString().split('\n');

function next(i) {
    if (i >= files.length) {
        doLint();
        return;
    }
    file = files[i];
    if(!file){
        next(++i);
        return;
    }
    sub_path = file.slice(1).trim();
    status = file.slice(0,1);
    file_path = path.resolve(root, sub_path);
    if(sub_path.match(isLibFileReg)){
        if(!status || status === 'A' || status === 'C'){ //允许在lib中增加,复制，但是不允许修改或者删除，需要询问确认
            return next(++i);
        }
        console.log('[ERROR] You cannot modified/deleted/renamed any file in lib directory！！');
        quit(1);
    }else if(fs.existsSync(file_path)){//进行其他校验，如eslint，htmlhint等。
        if(sub_path.match(isHTMLReg)){
            htmlFiles.push(file_path);
        }
        if(sub_path.match(isJSReg) && !sub_path.match(isMinJSReg)){
            jsFiles.push(file_path);
        }
        next(++i);
    }
};
next(0);
function doLint(){
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
