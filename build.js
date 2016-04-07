var fs = require('fs'),
    vfs = require('vinyl-fs'),
    map = require('map-stream');

var build = function (file, cb) {
    var tplContent = fs.readFileSync('./template.js', 'utf-8');
    var fileName = getFileName(file.path);
    var data = {
        hookType: fileName,
        hookContents: file.contents.toString()
            .replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\n')
            .replace(/'/g, '\\\'')
    };
    var result = tplContent.replace(/<%([^%>]+)%>/g, function (m, $1) {
        return data[$1.trim()];
    });
    renameFile(file, fileName + '.installer.js');
    file.contents = new Buffer(result);
    cb(null, file);
};
function renameFile(file, newName) {
    var path = file.path;
    file.path = path.replace(/\/([^\/]*)$/, function () {
        return '/' + newName;
    });
}
function getFileName(path) {
    var match = path.match(/\/([^\/]*)$/);
    if (match && match[1]) {
        return match[1].split('.')[0];
    }
    return '';
}
vfs.src(['**/*.js', '!node_modules/**/*', '!build.js', '!template.js','!lib/*.js', '!**/*.installer.js'])
    .pipe(map(build))
    .pipe(vfs.dest('.'));
