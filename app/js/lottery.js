//这里是有顺序要求的，因为有些语法需要使用babel-polyfill来处理，所以需要先导入它
import 'babel-polyfill';
import Base from './lottery/base.js';
import Timer from'./lottery/timer.js';
import Calculate from './lottery/calculate.js';
import Interface from './lottery/interface.js';
import $ from 'jquery';
// 深度拷贝
// es6里面Reflect.ownKeys可以拿到原对象的所有属性。参考Reflect
// 构造函数，原型，name 这3个属性不需要拷贝，所以要排除
const copyProperties = function(target,source){
	for(let key of Reflect.ownKeys(source)){
		if(key !== 'constructor' && key !== 'prototype' && key !== 'name'){
			//Object.getOwnPropertyDescriptor(obj, prop)
			//该方法允许对一个属性的描述进行检索。
			let desc=Object.getOwnPropertyDescriptor(source,key);
			//将source中的key值，以descripter的形式赋给target的key属性
			Object.defineProperty(target,key,desc);
		}
	}
}

const mix = function(...mixins){
	//声明一个空的类
	class Mix{}
	for(let mixin of mixins){
		copyProperties(Mix,mixin);
		//原型也都拷贝进来
		copyProperties(Mix.prototype,mixin.prototype);
	}
	return Mix;
}

class Lottery extends mix(Base,Calculate,Interface,Timer){
	constructor(name='syy',cname='11选5',issue='**',state='**'){
		super();
		this.name = name;
		this.cname = cname;
		this.issue = issue;
		this.state = state;
		this.issue_el = '#curr_issue';
		this.state_el = '.state_el';//状态选择器
        this.countdown_el = '#countdown';//倒计时选择器

		this.el = '';
		this.omit = new Map();//遗漏数据
		this.open_code = new Set();//开奖号码
		this.play_list = new Map();//玩法说明
		this.number = new Set();//开奖号码
		this.cart_el = '.codelist';//购物车选择器
		this.omit_el = '';//遗漏
		this.cur_play = 'r5';//默认玩法
		this.open_code_list = new Set();//开奖记录

		this.initPlayList();//base.js中实现
		this.initNumber();//base.js中实现
		this.updateState();
		this.initEvent();
	}
/**
 * [updateState 状态更新]
 * @return {[type]} [description]
 */
	updateState(){
		let self = this;
		//接口中定义的getState方法
		this.getState().then(function(res){
			self.issue = res.issue;//拿到期号
			self.end_time = res.end_time;//截止时间
			self.state = res.state;//拿到状态
			$(self.issue_el).text(res.issue);//更新期号
			//time.js中定义的倒计时方法
			self.countdown(res.end_time,function(time){
				$(self.countdown_el).html(time)
			},function(){
				setTimeout(function(){
					self.updateState();
					self.getOmit(self.issue).then(function(res){
					});
					self.getOpenCode(self.issue).then(function(res){
					})
				},500);
			})
		})
	}
/**
 * [initEvent 初始化事件]
 * @return {[type]} [description]
 */
	initEvent(){
		let self = this;
		$('.boll-list').on('click','.btn-boll',self.toggleCodeActive.bind(self));//号码的选中和取消
		$('#plays').on('click','li',self.changePlayNav.bind(self));//切换玩法
		$('.dxjo').on('click','li',self.assistHandle.bind(self));//操作区
		$('#confirm_sel_code').on('click',self.addCode.bind(self));//添加号码
		$('.qkmethod').on('click','.btn-middle',self.getRandomCode.bind(self));//添加随机号码
	}
}
export default Lottery
