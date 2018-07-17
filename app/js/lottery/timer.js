class Timer{
	/**
     * 倒计时方法
     * @param  number end    截止时间
     * @param  function update 每次更新时间时的回调函数
     * @param  function handle 倒计时结束时的回调函数
     * @return
     */
	countdown(end,update,handle){
		const now = new Date().getTime();
		const self = this;
		if(now - end > 0){
			//为了保证this指向保持不变，使用call并且传入self
			handle.call(self);
		}else{
			let last_time = end-now;
			//规定天小时分秒的常量
			const px_d = 24*60*60*1000;
			const px_h = 60*60*1000;
			const px_m = 60*1000;
			const px_s = 1000;
			//floor向下取整，除px_d得到天数。小时计算时需要去掉天数，依此类推
			let d =Math.floor(last_time/px_d);
			let h =Math.floor((last_time-d*px_d)/px_h);
			let m =Math.floor((last_time-d*px_d-h*px_h)/px_m);
			let s =Math.floor((last_time-d*px_d-h*px_h-m*px_m)/px_s);
			let r =[];
			// 判断数组长度主要是为了防止数据错乱，例如只有时，没有分，秒的情况
			if(d>0){
				r.push(`<em>${d}</em>天`);
			}
			if(r.length||(h>0)){
				r.push(`<em>${h}</em>时`);
			}
			if(r.length||(m>0)){
				r.push(`<em>${m}</em>分`);
			}
			if(r.length||(s>0)){
				r.push(`<em>${s}</em>秒`);
			}
			//执行更新回调函数，使用的是计算之后的倒计时时间
			update.call(self,r.join(''));
			//每秒回调一次
			setTimeout(function() {
				self.countdown(end,update,handle);
			}, 1000);
		}
	}
}

export default Timer;