{
  // 基本定义
  let ajax=function(callback){
    console.log('执行');
    setTimeout(function () {
      callback&&callback.call()
    }, 1000);
  };
  ajax(function(){
    console.log('timeout1');
  })
}

{
  let ajax=function(){
    console.log('执行2');
    return new Promise(function(resolve,reject){
      setTimeout(function () {
        resolve()
      }, 1000);
    })
  };

  ajax().then(function(){
    console.log('promise','timeout2');
  })
}

{
  let ajax=function(){
    console.log('执行3');
    return new Promise(function(resolve,reject){
      setTimeout(function () {
        resolve()
      }, 1000);
    })
  };

  ajax()
    .then(function(){
    return new Promise(function(resolve,reject){
      setTimeout(function () {
        resolve()
      }, 2000);
    });
  })
    .then(function(){
    console.log('timeout3');
  })
}

{
  let ajax=function(num){
    console.log('执行4');
    return new Promise(function(resolve,reject){
      if(num>5){
        resolve()
      }else{
        throw new Error('出错了')
      }
    })
  }

  ajax(6).then(function(){
    console.log('log',6);
  }).catch(function(err){
    console.log('catch',err);
  });

  ajax(3).then(function(){
    console.log('log',3);
  }).catch(function(err){
    console.log('catch',err);
  });
}

{
  // 所有图片加载完的加载页面
  function loadImg(src){
    return new Promise((resolve,reject)=>{
      let img = document.createElement('img');
      img.src = src;
      img.onload = function(){
        resolve(img);
      }
      img.onerror = function(err){
        reject(err);
      }
    })
  }

  function showImgs(imgs){
    imgs.forEach(function(img){
      document.body.appendChild(img);
    })
  }

  Promise.all([
    loadImg('http://image.baidu.com/search/detail?z=0&word=%E6%91%84%E5%BD%B1%E5%B8%88%E6%9D%BF%E6%A0%97&hs=0&pn=0&spn=0&di=0&pi=52310310419&tn=baiduimagedetail&is=1%2C137983&ie=utf-8&oe=utf-8&cs=2844934141%2C3682622922&os=&simid=&adpicid=0&lpn=0&fm=&sme=&cg=&bdtype=-1&oriquery=&objurl=http%3A%2F%2Fd.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff9198618367adab45913c15e87d4b31c8601e4e8.jpg&fromurl=&gsm=0&catename=pcindexhot'),
    loadImg('http://image.baidu.com/search/detail?z=0&word=%E6%91%84%E5%BD%B1%E5%B8%88%E6%9D%BF%E6%A0%97&hs=0&pn=0&spn=1&di=0&pi=52310310419&tn=baiduimagedetail&is=1%2C137983&ie=utf-8&oe=utf-8&cs=2844934141%2C3682622922&os=&simid=&adpicid=0&lpn=0&fm=&sme=&cg=&bdtype=-1&oriquery=&objurl=http%3A%2F%2Fh.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F8326cffc1e178a82befea5bdfa03738da877e8e9.jpg&fromurl=&gsm=0&catename=pcindexhot'),
    loadImg('http://image.baidu.com/search/detail?z=0&word=%E6%91%84%E5%BD%B1%E5%B8%88%E6%9D%BF%E6%A0%97&hs=0&pn=0&spn=2&di=0&pi=52310310419&tn=baiduimagedetail&is=1%2C137983&ie=utf-8&oe=utf-8&cs=2844934141%2C3682622922&os=&simid=&adpicid=0&lpn=0&fm=&sme=&cg=&bdtype=-1&oriquery=&objurl=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fb151f8198618367ad4e9b9c022738bd4b31ce54f.jpg&fromurl=&gsm=0&catename=pcindexhot')
    ]).then(showImgs);
}

