var fs = require('fs'),
    vfs = require('vinyl-fs'),
    map = require('map-stream'),
    UglifyJS = require('uglify-js');

var build = function(file, cb) {
  var tplContent = fs.readFileSync('./template.sh','utf-8');
  var fileName = getFileName(file.path);
  var data = {
    hookType:fileName,
    hookContents:UglifyJS.minify(file.path).code.replace(/"/g,'\\"')
  };
  var result = tplContent.replace(/<%([^%>]+)%>/g,function(m,$1){
    return data[$1.trim()];
  });
  renameFile(file,fileName+'-installer.sh');
  file.contents = new Buffer(result);
  cb(null, file);
};
function renameFile(file,newName){
    var path = file.path;
    file.path = path.replace(/\/([^\/]*)$/,function(m,fileName){
        return '/'+newName;
    });
}
function getFileName(path){
    var match = path.match(/\/([^\/]*)$/);
    if(match && match[1]){
        return match[1].split('.')[0];
    }
    return '';
}
vfs.src(['**/*.js', '!node_modules/**/*', '!build.js'])
    .pipe(map(build))
    .pipe(vfs.dest('.'));

