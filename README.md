### 一个自动更新版本号的小工具（a comman-line tool for update file version）

平常在开发过程中，修改了js或者css文件需要我们手动去被引入的文件修改版本号（这样就不会有缓存了）。很花费时间，于是我写了一个小小工具供日常使用

### 安装

> 请务必全局安装

```bash
npm install -g jscss-version
```

### 使用

1. cd到你的项目根目录

2. 运行命令

```bash
verr <target file> (目标文件，比如app/views/demo.html) <origin files> (监听的文件目录，需要以/结束。比如public/js/) <mode> (目标文件类型，html或者jade)
```

3. 例子

```bash
verr app/views/layout.jade public/js/ jade
```



