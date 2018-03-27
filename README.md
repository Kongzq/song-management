# 简单的歌曲管理页面

用七牛存储文件，leancloud存储七牛的外链url和歌曲信息

使用css3制作loading动画，划分多个模块，每个模块使用jquery+MVC，模块之间的通信用EventHub（订阅发布模式）

## 启动应用

1. npm i -g http-server
2. http-server -c-1
3. node server 8888
4. open http://127.0.0.1:8080/src/admin.html


## 功能

1. 点击或拖拽上传歌曲到七牛
2. 编辑歌曲信息并保存到leancloud
3. 上传时loading效果

![gif](https://github.com/Kongzq/song-management/blob/master/GIF.gif)
