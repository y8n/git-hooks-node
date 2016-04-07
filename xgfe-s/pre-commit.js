var child_process = require('child_process');
var execSync = child_process.execSync;
var spawnSync = child_process.spawnSync;
var path = require('path');

var files = getDiffFiles();
if(!files.length){
    quit();
}
var libFiles = files.filter(function (file) {
    return isLibFiles(file.subpath) && ~['d','m','c','r'].indexOf(file.status);
});
if(libFiles.length){
    console.log('[WARNING] You cannot delete/modify/copy/rename any file in lib directory！！\n' +
        'Listed below are thus files:');
    var libFilePaths = libFiles.map(function (file) {
        return file.subpath;
    }).join('\n');
    console.log(libFilePaths+'\n');
    quit(1);
}
// 待检查的文件相对路径
var lintFiles = files.filter(function (file) {
    return !isLibFiles(file.subpath)
        && !isDistFiles(file.subpath)
        && ~['a','m','c','r'].indexOf(file.status);
}).map(function (file) {
    return file.subpath;
});
var argv = ['lint'];
argv = argv.concat(lintFiles);
argv = argv.concat(['-c','src/.lintrc']);
var result = spawnSync('xg',argv);
if (result.stdout.length) {
    console.log(result.stdout.toString());
}
if(result.stderr.length){
    console.error(result.stderr.toString());
}
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
}
/**
 * 是否是lib目录下的文件,xCharts除外
 */
function isLibFiles(subpath){
    return subpath.match(/^src\/lib\/.*/i)
        && !subpath.match(/^src\/lib\/xCharts\/.*/i);
}
/**
 * 是否是dist目录下的文件
 */
function isDistFiles(subpath){
    return subpath.match(/^dist\/.*/i);
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
