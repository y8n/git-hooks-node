var child_process = require("child_process"),
    execSync = child_process.execSync;

var path = require('path');

/**
 * 获取当前分支
 * @returns {*}
 */
exports.getCurrentBranch = function getCurrentBranch() {
    var result = execSync("git branch --column");
    var branchs = result.toString().split(' ');
    var len = branchs.length, branch, currentBranch;
    for (var i = 0; i < len; i++) {
        branch = branchs[i].trim();
        if (branch && branch === '*') {
            currentBranch = branchs[i + 1];
            if (currentBranch) {
                currentBranch = currentBranch.replace(/(^\n)|(\n$)/g, '')
            }
            break;
        }
    }
    return currentBranch;
};
/**
 * 获取所有变动的文件,包括增(A)删(D)改(M)重命名(R)复制(C)等
 * @param [type] {string} - 文件变动类型
 * @returns {Array}
 */
exports.getDiffFiles = function getDiffFiles(type) {
    var DIFF_COMMAND = 'git diff --cached --name-status HEAD';
    var root = process.cwd();
    var files = execSync(DIFF_COMMAND).toString().split('\n');
    var result = [];
    type = type || 'admrc';
    var types = type.split('').map(function (t) {
        return t.toLowerCase();
    });
    files.forEach(function (file) {
        if(!file){
            return;
        }
        var temp = file.split(/[\n\t]/);
        var status = temp[0].toLowerCase();
        var filepath = root+'/'+temp[1];
        var extName = path.extname(filepath).slice(1);

        if(types.length && ~types.indexOf(status)){
            result.push({
                status:status, // 文件变更状态-AMDRC
                path:filepath, // 文件绝对路径
                subpath:temp[1], // 文件相对路径
                extName:extName // 文件后缀名
            });
        }
    });
    return result;
};
console.log(exports.getDiffFiles());