{
  let view = {
    el: '.page > main',
    init(){
      this.$el = $(this.el) 
    },
    template: `
      <form class="form">
        <div class="row">
          <label>
          歌名
          </label>
          <input name="name" type="text" value="__name__">
        </div>
        <div class="row">
          <label>
          歌手
          </label>
          <input name="singer" type="text" value="__singer__">
        </div>
        <div class="row">
          <label>
          外链
          </label>
          <input name="url" type="text" value="__url__">
        </div>
        <div class="row">
          <label>
          封面
          </label>
          <input name="cover" type="text" value="__cover__">
        </div>
        <div class="row">
          <label>
          歌词
          </label>
          <textarea cols=100 rows=10 name="lyrics">__lyrics__</textarea>
        </div>
        <div class="row actions">
          <button type="submit">保存</button>
        </div>
      </form>
    `,
    render(data = {}){
      let placeholders = ['name', 'url', 'singer', 'id', 'cover', 'lyrics']
      let html = this.template
      placeholders.map((string)=>{
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)

      //当用户选中'新建歌曲'或'歌曲名'，在右侧显示不同的h1
      if(data.id){
        $(this.el).prepend('<h1>编辑歌曲</h1>') //prepend() 方法在被选元素的开头（仍位于内部）插入指定内容。
      }else{
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    },
    reset(){
      this.render( {} )
    }
  }
  let model = {
    data: {
      name: '', singer: '', url: '', id: '', cover: '', lyrics: ''
    },
    update(data){
       // 这里的api来自leancloud的“数据存储开发指南”的对象-更新对象
      //  更新用户修改的歌曲信息
      var song = AV.Object.createWithoutData('Song', this.data.id)
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('lyrics', data.lyrics)
      song.set('url', data.url)
      song.set('cover', data.cover)
      return song.save().then((response)=>{  
        Object.assign(this.data, data)
        return response
      })
    },
    save(formdata){  //保存form的数据到leancloud
      var Song = AV.Object.extend('Song');
      var song = new Song();
      song.set('name',formdata.name);
      song.set('singer',formdata.singer);
      song.set('lyrics', formdata.lyrics)
      song.set('url',formdata.url);
      song.set('cover',formdata.cover);
      // 这里的api来自leancloud的“数据存储开发指南”的对象-保存对象
      return song.save().then((savedData) =>{
        let {id, attributes} = savedData
        Object.assign(this.data, { id:id, ...attributes }) 
      }, (error) =>{
        console.error(error);
      });    
    }
  }
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('select', (data)=>{
        this.model.data = data
        this.view.render(this.model.data)
      })

      window.eventHub.on('new', (data)=>{
       //当用户点击'新建歌曲'，判断当前显示的歌曲信息有没保存，如果用户没保存，就不清空歌曲信息，如果已经保存了，右侧已有的歌曲信息被清空
        if(this.model.data.id){
      
          this.model.data = {
            name: '', url: '', id: '', singer: '', lyrics: ''
          }
        }else{
          Object.assign(this.model.data, data)
        }
        this.view.render(this.model.data)
      })
    },
    create(){
      let needs = 'name singer url cover lyrics'.split(' ')  // 相当于  ['name', 'singer', 'url','cover', 'lyrics'] 
      let formdata = {}
      needs.map((string)=>{
        formdata[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      this.model.save(formdata)
        .then(()=>{
          this.view.reset()  //点保存后清空form的数据
    


          let string = JSON.stringify(this.model.data)
          let object = JSON.parse(string)
          window.eventHub.emit('create', object)


        })
    },
    update(){
      let needs = 'name singer url cover lyrics'.split(' ')  
      let data = {}
      needs.map((string)=>{
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      this.model.update(data)
        .then(()=>{
          window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
        })
    },
    bindEvents(){
      this.view.$el.on('submit', 'form', (e)=>{
        e.preventDefault()

  
        //如果歌曲已被保存，那么执行update，更新用户修改的歌曲信息，create是保存用户的新的歌曲信息
        if(this.model.data.id){
          this.update()  
        }else{
          this.create()
        }
      })
    }
  }
  controller.init(view, model)

}
