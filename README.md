# git-hooks-node

使用Node.JS编写git hooks。本切图仔Shell实在是不熟练，项目中有使用hooks的地方，写起来实在是要我命，所以就萌发了用Node写hooks的想法。  
hooks的原理就是执行特定的脚本，通过判断脚本的退出结果确定是否终止操作，既然shell能办到，node写脚本也是666的。为了尽可能省（fan）事（lan），可以通过curl命令来安装，人工只需要**写hooks**，**构建发布**，**curl安装**，三个主要步骤即可。同项目其他成员需要用该hooks的话只需要最后一步安装即可。

## 编写Hooks

- 1.clone仓库

	```	
	git clone https://github.com/y8n/git-hooks-node.git 
	```	
- 2.安装依赖
	
	```
	npm install
	``` 
- 3.编写hooks  
创建项目目录，如`my-project`，再在该目录下创建自己需要的hooks，命名必须是hooks的名字，如`pre-commit.js`。  
文件创建完成之后，即可使用node编写程序，在需要终止git操作的时候调用`process.exit(1)`即可，没有错误的话正常退出，即`process.exit(0)`。  
**注：脚本中不建议引入第三方npm包**

## 构建发布
- 1.在根目录下执行`node build.js`或`npm run build`即可完成构建，此时在刚才写的hooks同级目录下会生成另一个js文件。
- 2.发布到远端仓库，接下来就可以使用github的raw来安装啦。

## curl安装
- 1.获取生成的js文件的raw链接，如`https://github.com/y8n/git-hooks-node/blob/master/xgfe-ma/pre-commit.installer.js`。前提是将代码推送到github远端
- 2.执行下面代码进行安装

	```
	curl -s raw链接 | node
	```

**一次发布，处处安装！**
	
## License
MIT	