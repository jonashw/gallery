function ImageViewerPlayer(imageViewer,imageProvider){
	this.imageViewer = imageViewer;
	this.imageProvider = imageProvider;
	this.slide_delay = 300;
	this.wrap_mode = true;
	this.is_sliding = false;
	this.timeout = false;
	var self = this;
	this.imageViewer.on('close',function(){
		self.stop();//stop the show when the viewer closes
	});
	new Observable(this);
	this.on('slideshowStart slideshowStop wrapChanged', function(){
		self.notifyObservers('stateChanged');
		console.log('statechanged');
	});
}
ImageViewerPlayer.prototype.next = function(){
	if(!this.canNext()){
		this.stop(); 
		return false;
	}
	var self = this;
	this.imageProvider.getNext(function(image){
		self.imageViewer.viewImage(image);
		self.notifyObservers('nextImage',image);
	});
}
ImageViewerPlayer.prototype.prev = function(){
	if(!this.canPrev()){
		this.stop(); 
		return false;
	}
	var self = this;
	this.imageProvider.getPrev(function(image){
		self.imageViewer.viewImage(image);
		self.notifyObservers('prevImage',image);
	});
}
ImageViewerPlayer.prototype.currentIndex = function(){
	return this.imageProvider.getCurrentIndex();
}
ImageViewerPlayer.prototype.start = function(){
	if(!this.canStart()) return false;
	//console.log('show start!');
	this.is_sliding = true;
	var self = this;
	(function slideLoop(){//recursive async function
		self.timeout = setTimeout(function(){
			self.slide();
			slideLoop();
		}, self.slide_delay);
	})();
	this.notifyObservers('slideshowStart');
}
ImageViewerPlayer.prototype.slide = function(){
	if(!this.canSlide()) return false;
	this.next();
}
ImageViewerPlayer.prototype.stop = function(){
	if(!this.canStop()) return false;
	//console.log('show stop!');
	this.is_sliding = false;
	clearTimeout(this.timeout);
	this.notifyObservers('slideshowStop');
}
ImageViewerPlayer.prototype.setWrap = function(bool){
	this.wrap_mode = bool;
	this.notifyObservers('wrapChanged');
}
ImageViewerPlayer.prototype.imageCount = function(){
	return this.imageProvider.getImageCount();
}
ImageViewerPlayer.prototype.currentIndex = function(){
	return this.imageProvider.getCurrentIndex();
}
ImageViewerPlayer.prototype.canStart 	= function(){ return this.imageViewer.isOpen() && this.hasNext() && !this.isPlaying(); }
ImageViewerPlayer.prototype.canStop 	= function(){ return this.isPlaying(); }
ImageViewerPlayer.prototype.canContinue = function(){ return this.canNext() && this.isPlaying(); }
ImageViewerPlayer.prototype.canSlide 	= function(){ return this.canNext() && this.isPlaying(); }
ImageViewerPlayer.prototype.canPrev 	= function(){ return this.imageViewer.isOpen() && this.hasPrev(); }
ImageViewerPlayer.prototype.canNext 	= function(){ return this.imageViewer.isOpen() && this.hasNext(); }
ImageViewerPlayer.prototype.canWrap 	= function(){ return this.wrap_mode; };
ImageViewerPlayer.prototype.isPlaying 	= function(){ return this.is_sliding; }
ImageViewerPlayer.prototype.hasPrev 	= function(){ return this.imageProvider.hasPrev() || (this.canWrap() && this.imageCount()); };
ImageViewerPlayer.prototype.hasNext 	= function(){ return this.imageProvider.hasNext() || (this.canWrap() && this.imageCount()); };
