import $ from 'jquery';
class Base{
	/**
	 * [initPlayList 初始化奖金和玩法及说明]
	 * @return {[type]} [description]
	 */
	initPlayList(){    //map集合，使用set进行赋值
		this.play_list.set('r2',{
			bonus:6,
			tip:'从01～11中任选2个或多个号码，所选号码与开奖号码任意两个号码相同，即中奖<em class="red">6</em>元',
			name:'任二'
		})
		.set('r3',{
			bonus:19,
			tip:'从01～11中任选3个或多个号码，所选号码与开奖号码任意三个号码相同，即中奖<em class="red">19</em>元',
			name:'任三'
		})
		.set('r4',{
			bonus:78,
			tip:'从01～11中任选4个或多个号码，所选号码与开奖号码任意四个号码相同，即中奖<em class="red">78</em>元',
			name:'任四'
		})
		.set('r5',{
			bonus:540,
			tip:'从01～11中任选5个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">540</em>元',
			name:'任五'
		})
		.set('r6',{
			bonus:90,
			tip:'从01～11中任选6个或多个号码，所选号码与开奖号码五个号码相同，即中奖<em class="red">90</em>元',
			name:'任六'
		})
		.set('r7',{
			bonus:26,
			tip:'从01～11中任选7个或多个号码，所选号码与开奖号码五个号码相同，即中奖<em class="red">26</em>元',
			name:'任七'
		})
		.set('r8',{
			bonus:9,
			tip:'从01～11中任选8个或多个号码，所选号码与开奖号码五个号码相同，即中奖<em class="red">9</em>元',
			name:'任八'
		})
	}
/**
 * [initNumber 初始化号码]
 * @return {[type]} [description]
 * 这里的初始化号码应为需要补0，需要使用es7才提供的padStart，需要借助babel-polyfill来实现，因为他的方便易用性，所以会大量的使用
 */
	initNumber(){
		for(let i=1;i<12;i++){
		//set数据结构，使用add编辑元素
		this.number.add((''+i).padStart(2,'0'))
    	}	
	}
/**
 * [setOmit 设置遗漏数据]
 * @param {[type]} omit [description]
 */
	setOmit(omit){
		let self = this;
		//map结构数据处理。omit为map结构
		self.omit.clear();
		//for of 遍历接口
		for(let [index,item] of omit.entries()){                  
			self.omit.set(index,item)
		}
		//_el为选中的dom元素
		$(self.omit_el).each(function(index,item){
			$(item).text(self.omit.get(index))
		});
	}
/**
 * [setOpenCode 设置开奖]
 * @param {[type]} code [description]
 */
	setOpenCode(code){
		let self = this;
		self.open_code.clear();
		for(let item of code.values()){
			self.open_code.add(item)
		}
		//如果存在则调用这个接口
		self.updateOpenCode&&self.updateOpenCode.call(self,code);
	}
/**
 * [toggleCodeActive 号码选中取消]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
	toggleCodeActive(e){
		let self = this;
		// 1. e.target:触发事件的某个具体对象，只会出现在事件流的目标阶段（谁触发谁命中，所以肯定是目标阶段）
		// 2. e.currentTarget:绑定事件的对象，恒等于this，可能出现在事件流的任意一个阶段中
		let $cur = $(e.currentTarget);
		$cur.toggleClass('btn-boll-active');
		self.getCount();
	}
/**
 * [chagePlayNav 切换玩法]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
	changePlayNav(e){
		let self = this;
		let $cur = $(e.currentTarget);
		$cur.addClass('active').siblings().removeClass('active');
		//desc
		self.cur_play = $cur.attr('desc').toLocaleLowerCase();
		//获取玩法中的tip值,html方法是返回或设置内容，空白返回。
		$('#zx_sm span').html(self.play_list.get(self.cur_play).tip)
		//切换玩法时清空上一次选中的所有号码
		$('.boll-list .btn-boll').removeClass('btn-boll-active');
		self.getCount();
	}	
/**
 * [assistHandle 操作区]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
	assistHandle(e){
		//阻止执行与事件关联的默认动作，提交表单等
		e.preventDefault();
		let self = this;
		let $cur = $(e.currentTarget);
		let index = $cur.index();
		$('.boll-list .btn-boll').removeClass('btn-boll-active');
		//全
		if(index === 0){
			$('.boll-list .btn-boll').addClass('btn-boll-active');
		}
		//大
		if(index === 1){
			$('.boll-list .btn-boll').each(function(i,t){
				if(t.textContent-5>0){
					$(t).addClass('btn-boll-active');
				}
			})
		}
		//小
		if(index === 2){
			$('.boll-list .btn-boll').each(function(i,t){
				if(t.textContent-6<0){
					$(t).addClass('btn-boll-active');
				}
			})
		}
		//奇
		if(index === 3){
			$('.boll-list .btn-boll').each(function(i,t){
				if(t.textContent%2 == 1){
					$(t).addClass('btn-boll-active');
				}
			})
		}
		//偶
		if(index === 4){
			$('.boll-list .btn-boll').each(function(i,t){
				if(t.textContent%2 == 0){
					$(t).addClass('btn-boll-active');
				}
			})
		}
		self.getCount();
	}
/**
 * [getName 获取当前彩票名称]
 * @return {[type]} [description]
 */
	getName(){
		return this.name
	}

	addCode(){
		let self = this;
		//  \d代表数字，n{X}为匹配X个n的序列的字符串，g为全文检索
		let $active = $('.boll-list .btn-boll-active').text().match(/\d{2}/g);
		let active = $active?$active.length:0;
		let count = self.computeCount(active,self.cur_play);
		//第一项为玩法字符串，第二项为,第三项为名称，第四项为注数
		if(count){
			self.addCodeItem($active.join(' '),self.cur_play,self.play_list.get(self.cur_play).name,count)
		}
	}

/**
   * [addCodeItem 添加单次号码]
   * @param {[type]} code     [description]
   * @param {[type]} type     [description]
   * @param {[type]} typeName [description]
   * @param {[type]} count    [description]
   */
  addCodeItem(code,type,typeName,count){
    let self=this;
    // es6的字符串模板使用
    const tpl=`
    <li codes="${type}|${code}" bonus="${count*2}" count="${count}">
         <div class="code">
             <b>${typeName}${count>1?'复式':'单式'}</b>
             <b class="em">${code}</b>
             [${count}注,<em class="code-list-money">${count*2}</em>元]
         </div>
     </li>
    `;
    //添加到购物车
    $(self.cart_el).append(tpl);
    self.getTotal(); //获取彩票票价的总金额
  }
/**
 * [getCount 重新计算逻辑]
 * @return {[type]} [description]
 */
  getCount(){
  	let self = this;
  	let active = $('.boll-list .btn-boll-active').length;
  	let count = self.computeCount(active,self.cur_play);
  	let range = self.computeBonus(active,self.cur_play);
  	let money = count*2;
  	let win1 = range[0]-money;
  	let win2 = range[1]-money;
  	let tpl;
  	let c1 = (win1<0&&win2<0)?Math.abs(win1):win1;
	let c2 = (win1<0&&win2<0)?Math.abs(win2):win2;
	if(count===0){
		tpl = `您选了<b class="red">${count}</b>注，共<b class="red">${count*2}</b>元`
	}else if(range[0]===range[1]){
		tpl = `您选了<b>${count}</b>注，共<b>${count*2}</b> 元 <em>若中奖，奖金：
		<strong class="red">${range[0]}</strong>元，
		您将${win1>=0?'盈利':'亏损'}
		<strong class="${win1>=0?'red':'green'}">${Math.abs(win1)}</strong> 元 </em>`
	}else{
		tpl = `您选了<b>${count}</b>注，共<b>${count*2}</b> 元 <em>若中奖，奖金：
		<strong class="red">${range[0]}</strong>至<strong class="red">${range[1]}</strong>元，
		您将${(win1<0&&win2<0)?'亏损':'盈利'}
		<strong class="${win1>=0?'red':'green'}">${c1}</strong> 至
		<strong class="${win2>=0?'red':'green'}">${c2}</strong> 
		元 </em>`
	}
	$('.sel_info').html(tpl);
  }
/**
 * [getTotal 计算所有金额]
 * @return {[type]} [description]
 */
  getTotal(){
  	let count = 0;
    $('.codelist li').each(function(index,item){
      count+=$(item).attr('count')*1;
    })
  	$('#count').text(count);
  	$('#money').text(count*2);
  }
/**
 * [getRandom 生成随机数字]
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
  getRandom(num){
  	let arr = [],index;
  	//initNumber中做了初始化
  	let number = Array.from(this.number);
  	while(num--){
  		//parseInt 函数将其第一个参数转换为字符串，解析它，并返回一个整数或NaN
  		index = Number.parseInt(Math.random()*number.length)
  		//index最高11
  		arr.push(number[index]);
  		//将number数组中的用过的删除
  		number.splice(index,1);
  	}
  	return arr.join(' ');
  }
/**
 * [getRandomCode 添加随机号码]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
  getRandomCode(e){
  	e.preventDefault();
  	let num = e.currentTarget.getAttribute('count');
  	let play = this.cur_play.match(/\d+/g)[0];
  	let self = this;
  	if(num === '0'){
  		$(self.cart_el).html('')
  	}else{
  		for(let i=0;i<num;i++){
  			self.addCodeItem(self.getRandom(play),self.cur_play,self.play_list.get(self.cur_play).name,1)
  		}
  	}
  }
}
export default Base
