var Promise = function(){
	this.pending = [];
}

Promise.prototype = {
	then: function(onResolve, onReject){

		this.pending.push({ 
			resolve: onResolve, 
			reject: onReject 
		})

		return this
	},

	resolve: function(data){
		this.then = function(reject, resolve){ 
			resolve && resolve(data) 
		}

		this.executePending('resolve', data)
	},

	reject: function(data){
		this.then = function(reject, resolve){ 
			reject && reject(data) 
		}

		this.executePending('reject', data)
	},

	executePending: function(type, data){
		var p, i = 0
		while (p = this.pending[i++]) { 
			p[type] && p[type](data) 
		}

		delete this.pending
	}
