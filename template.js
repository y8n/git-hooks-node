var fs = require('fs');
var hookType = '<% hookType %>',
    hookPath='.git/hooks/'+hookType,
    hookContents='<% hookContents %>';

hookContents = '#!/usr/bin/env node\n\n'+hookContents;
fs.writeFile(hookPath,hookContents,{
    mode:'0755'
}, function (err) {
    if(err){
        return console.log('[ERROR]:%s',err);
    }
    console.log('[INFO]:'+hookType+' installed successfully.');
});
