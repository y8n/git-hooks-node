var child_process = require("child_process");
var execSync = child_process.execSync;
var spawnSync = child_process.spawnSync;
var path = require('path');

var fileList = getDiffFiles();

var srcFiles = fileList.filter(function(file){
    return isSourceFile(file) ? true : false;
}).map(function(file){
    return file.path;
});

if(srcFiles.length === 0){
    quit(0);
}

var argv = ['lint'];
argv = argv.concat(srcFiles);
argv = argv.concat(['-c', './.lintrc']);
var result = spawnSync('xg', argv, {stdio: 'inherit'});
quit(result.status);

/**
 * 获取所有变动的文件,包括增(A)删(D)改(M)重命名(R)复制(C)等
 * @param [type] {string} - 文件变动类型
 * @returns {Array}
 */
function getDiffFiles(type) {
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

function isSourceFile(file){
    return /src\//.test(file.path) && file.extName === 'js'
}

/**
 * 退出
 * @param errorCode
 */
function quit(errorCode) {
    if (errorCode) {
        console.log('Commit aborted.');
    }
    process.exit(errorCode || 0);
}
