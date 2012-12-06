function ImageViewerPlayer(imageViewer){
	this.imageViewer = imageViewer;
	this.is_sliding = false;
	this.slide_delay = 300;
	this.timeout = false;

	var self = this;
	this.imageViewer.container.on('close',function(){//stop the show when the viewer closes
		self.stop();
	});
}
ImageViewerPlayer.prototype.start = function(){
	if(!this.canStart()) return false;
	//console.log('show start!');
	this.is_sliding = true;
	var self = this;
	(function slideLoop(){//recursive async function
		self.timeout = setTimeout(function(){
			self.next();
			slideLoop();
		}, self.slide_delay);
	})();
	this.imageViewer.container.trigger('slideShowStart');
}
ImageViewerPlayer.prototype.next = function(){
	if(!this.canContinue()){
		this.stop(); 
		return false;
	}
	this.imageViewer.nextImage();
	//self.imageViewer.container.trigger('slide');
}
ImageViewerPlayer.prototype.stop = function(){
	if(!this.canStop()) return false;
	//console.log('show stop!');
	this.is_sliding = false;
	clearTimeout(this.timeout);
	this.imageViewer.container.trigger('slideShowStop');
}
ImageViewerPlayer.prototype.canStart = function(){
	return this.imageViewer.isOpen() && this.imageViewer.hasNext() && !this.is_sliding;
}
ImageViewerPlayer.prototype.canStop = function(){
	return this.is_sliding;
}
ImageViewerPlayer.prototype.canContinue = function(){
	return this.imageViewer.isOpen() && this.imageViewer.hasNext() && this.is_sliding;
}
ImageViewerPlayer.prototype.isPlaying = function(){
	return this.is_sliding;
}
