class Calculate{
	/**
	 * [computeCount 计算注数]
	 * @param  {number} active    [当前选中的号码个数]
	 * @param  {string} play_name [当前的玩法标志]
	 * @return {number}           [购买的注数]
	 */
	computeCount(active,play_name){
		let count = 0;
		//使用ES6的map结构，判断玩法中是否有某种玩法（set形式）
		const exist = this.play_list.has(play_name);
		//使用ES6的填充数组功能fill,生成长度为active的数组，并全部填充为0
		const arr = new Array(active).fill('0');
		//如果存在或者玩法的第一位叫r，则调用静态方法combine
		if(exist && play_name.at(0) === 'r'){
			count = Calculate.combine(arr,play_name.split('')[1]).length;//split是字符串方法，即用空格隔开
		} 
		return count; 
	}

/**
 * [computeBouns 奖金范围预测]
	 * @param  {number} active    [当前选中的号码个数]
	 * @param  {string} play_name [当前的玩法标志]
	 * @return {array}            [奖金范围]
 */
	computeBonus(active,play_name){
		const play = play_name.split('');//分成r和数字
		const self = this;
		let arr = new Array(play[1]*1).fill(0);//与computeCount用法类似
		let min,max;
		if(play[0] === 'r'){
			//设计一个概念叫最小命中数min_active
			let min_active = 5-(11-active);	
			//业务逻辑								
			if(min_active>0){												
				if(min_active-play[1]>=0){									
					arr = new Array(min_active).fill(0);					
					min = Calculate.combine(arr,play[1]).length;
				}else{														
					if(play[1]-5>0&&active-play[1]>=0){						
						arr = new Array(active-5).fill(0);					
						min = Calculate.combine(arr,play[1]-5).length;		
					}else{
						min = active-play[1]>-1?1:0;						
					}
				}
			}else{															
				min = active-play[1]>-1?1:0;								
			}

			let max_active=Math.min(active,5);
			if(play[1]-5>0){
				if(active-play[1]>=0){
					arr = new Array(active-5).fill(0);
					max = Calculate.combine(arr,play[1]-5).length;
				}else{
					max = 0;
				}
			}else if(play[1]-5<0){
				arr = new Array(Math.min(active,5)).fill(0);
				max = Calculate.combine(arr,play[1]).length;
			}else{
				max=1;
			}
		}
		return [min,max].map(item=>item*self.play_list.get(play_name).bonus);
	}


/**
 * [combine 组合运算C（m，n）运用递归的方法]
 * @param  {[array]} arr  [参与组合运算的数组]
 * @param  {[number]} size [组合运算的基数]
 * @return {[type]}      [计算注数]
 */
	static combine(arr,size){
		let allResult = [];
		//立即执行函数(function foo(){})(),声明函数后直接调用自身
		(function f(arr,size,result){
			let arrLen = arr.length;
			//即玩法基数大于选择注数，如任五选了四注
			if(size > arrLen){
				return;
			}
			//即玩法基数等于选择注数，如任五选了五注
			if(size === arrLen){
				allResult.push([].concat(result,arr))
			}else{          //玩法基数小于选择注数，如任五选了五注以上
				//递归算法
				for(let i=0;i<arrLen;i++){
					let newResult = [].concat(result);    
					newResult.push(arr[i]);
					if(size === 1){
						allResult.push(newResult)		
					}else{
						let newArr = [].concat(arr);
						newArr.splice(0,i+1);			//splice(index,howmany,item)
						f(newArr,size-1,newResult)
					}
				}
			}
		})(arr,size,[])
		return allResult;
	}
}
export default Calculate;