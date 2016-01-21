#!/bin/sh

output=".git/hooks/<% hookType %>"
hookContents="<% hookContents %>"
echo "#!/usr/bin/env node" > ${output}
echo "" >> ${output}
echo ${hookContents} >> ${output}
chmod +x ${output}
echo "<% hookType %> installed successfully."
