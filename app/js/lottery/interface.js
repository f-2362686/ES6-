import $ from 'jquery';

class Interface{
	/**
	 * 获取遗漏的数据
	 * @param  {[type]}
	 * @return {[type]}cccc
	 */
	getOmit(issue){
		//对当前对象的引用
		let self = this;
		return new Promise((resolve,reject)=>{
			$.ajax({
				url: '/get/omit',
				dataType: 'json',
				//开奖号码
				data: {issue:issue},
				success:function(res){
					//对象的方式保存数据.避免回调
					self.setOmit(res.data);
					resolve.call(self,res)
				},
				error:function(err){
					reject.call(err);
				}
			})
		});
	}
	/**
	 * 获取开奖号码
	 * @param  {[type]}
	 * @return {[type]}
	 */
	getOpenCode(issue){
		let self = this;
		return new Promise((resolve,reject)=>{
			$.ajax({
				url:'/get/opencode',
				dataType: 'json',
				data:{issue:issue},
				success:function(res){
					self.setOpenCode(res.data);
					resolve.call(self,res);
				},
				error:function(err){
					reject.call(err);
				}
			})
		});
	}
	/**
	 * 获取当前状态
	 * @param  {[type]}
	 * @return {[type]}
	 */
	getState(issue){
		let self = this;
		return new Promise((resolve,reject)=>{
			$.ajax({
				url:'/get/state',
				dataType: 'json',
				data:{issue:issue},
				success:function(res){
					resolve.call(self,res);
				},
				error:function(err){
					reject.call(err);
				}
			})
		});
	}
}

export default Interface;
