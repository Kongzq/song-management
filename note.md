

leancloud 不能存文件,所以用七牛存储mp3文件，而leancloud存储七牛的外链url


1. 上传歌曲后就在form显示歌曲的数据，看upload-song.js的FileUploaded和song-form.js的
```
 window.eventHub.on('new', (data)=>{
   if(this.model.data.id){
     this.model.data = {
       name: '', url: '', id: '', singer: '', lyrics: ''
     }
   }else{
     Object.assign(this.model.data, data)
   }
   this.view.render(this.model.data)
 })


```


2. 上传歌曲后，点'保存'，保存form的数据然后清空form看song-from.js的controller的create和bindEvents



3. 上传歌曲后，点'保存'，'新建歌曲'下面就会出现歌名，看song-from.js的controller的bindEvents和create
 和
 ```
 song-list.js的
 window.eventHub.on('create', (songData)=>{
   
  this.model.data.songs.push(songData)
   this.view.render(this.model.data)
 })

```

5. 刚进入网页就在'新建歌曲'下面展示已经上传的歌曲，看song-list的controller -getAllSong


6. 点击歌曲名，相应栏被添加灰色背景，同时'新建歌曲'那栏被取消灰色背景，同时在右侧显示歌曲信息
song-form 的  
```
   window.eventHub.on('select', (data)=>{
        this.model.data = data
        this.view.render(this.model.data)
 })

 song-list的bindEvents
```



用户点击'新建歌曲'后发生的变化看song-list和song-form 订阅的new事件，搜索new
```
   window.eventHub.on('new',()=>{
      })

new-song.js的
    $(this.view.el).on('click', ()=>{
        window.eventHub.emit('new')
      })
触发new事件

```

8. 上传文件中的Loading效果看default.css的/* loading */模块和loading.js
