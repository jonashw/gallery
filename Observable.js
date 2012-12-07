function Observable(){
	this.observers = {};
}
Observable.prototype.addObserver = function(event_names, callback){
	var event_names = event_names.split(' ');//one listener can listen for several events
	for(var i in event_names){//set listener for each event
		var event_name = event_names[i];
		if (!(event_name in this.observers)) this.observers[event_name] = []; //add missing entry for this observable event type
		this.observers[event_name].push(callback);
	}
}
Observable.prototype.notifyObservers = function(event_name){
	if (!(event_name in this.observers)){
		return false;
	}
	var observers = this.observers[event_name];
	var args=[];
	if(arguments.length > 1){
		for(var i=1; i<arguments.length; i++){
			args.push(arguments[i]);
		}
	}
	for(var i=0; i<observers.length; i++){
		observers[i].apply(null, args);
	}
}
