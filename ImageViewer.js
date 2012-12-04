function ImageViewer(container,imageProvider){
	this.image;
	this.wrap_mode = true;
	this.slide_delay = 1000;
	//core data
	this.is_zoomed = false;
	this.is_sliding = false;
	this.slideTimeout = null;
	this.is_open = false;
	this.container = container;
	this.imageProvider = imageProvider;
}
//settings (later moved to a public constructor)
//core methods (mutators)
ImageViewer.prototype.imageCount = function(){
	return this.imageProvider.getImageCount();
}
ImageViewer.prototype.currentIndex = function(){
	return this.imageProvider.getCurrentIndex();
}
ImageViewer.prototype.nextImage = function(){
	if (!this.canNext()) return false;
	var image = this.imageProvider.getNext();
	this.viewImage(image);
	this.container.trigger('nextImage',image);
}
ImageViewer.prototype.prevImage = function(){
	if (!this.canPrev()) return false;
	var image = this.imageProvider.getPrev();
	this.viewImage(image);
	this.container.trigger('prevImage',image);
}
ImageViewer.prototype.viewImage = function(image){
	if(this.image) this.image.detach();
	image.appendTo(this.container);	
	this.image = image;
	this.sizeToFit();
	this.container.trigger('imageLoaded',image);
}
ImageViewer.prototype.open = function(){
	var image = this.imageProvider.getFirst();
	this.viewImage(image);
	this.is_open = true;
	this.container.trigger('open');
}
ImageViewer.prototype.close = function(){
	if(this.image) this.image.detach();
	this.is_open = false;
	this.container.trigger('close');
}
ImageViewer.prototype.startSlideShow = function(){
	if(!this.canStartSlideShow()) return false;
	console.log('show start!');
	this.is_sliding = true;
	var self = this;
	this.slideTimeout = setInterval(function(){
		self.slideNext();
	}, this.slide_delay);
	this.container.trigger('slideShowStart');
}
ImageViewer.prototype.slideNext = function(){
	if(!this.canSlide() || !this.canNext()) this.stopSlideShow(); 
	this.nextImage();
}
ImageViewer.prototype.stopSlideShow = function(){
	if(!this.canStopSlideShow()) return false;
	console.log('show stop!');
	this.is_sliding = false;
	clearTimeout(this.slideTimeout);
	this.container.trigger('slideShowStop');
}
ImageViewer.prototype.sizeToFit = function(){
	min = function(){
		var m;
		for(var i in arguments) if((!m) || arguments[i] < m) m = arguments[i];
		return m;
	}
	var wh = $(window).height();
	var ww = $(window).width();
	//console.log(this.container);
	var ch = this.container.height();
	var cw = this.container.width();
	//var w = min(ww,cw);
	//var h = min(wh,ch);
	//console.log('width',ww,cw,w);
	//console.log('height',wh,ch,h);
	//scale the image to fit the available space
	this.image.css({
		'max-width': ww + 'px',
		'max-height': wh + 'px'
	});
	//center the image horizontally and vertically
	var ih = this.image.height()
	var iw = this.image.width()
	this.image.css({
		'position': 'absolute',
		'left': (ww - iw) / 2 + 'px',
		'top': (wh - ih) /2 + 'px'
	});
	this.is_zoomed = false;
}
ImageViewer.prototype.zoom = function(){
	if(!this.canZoom()) return false;
	this.image.removeAttr('style');
	this.container.addClass('zoomed');
	this.is_zoomed = true;
	this.container.trigger('zoom',this.image);
}
ImageViewer.prototype.unzoom = function(){
	if(!this.canUnzoom()) return false;
	this.sizeToFit();
	this.is_zoomed = false;
	this.container.trigger('unzoom',this.image);
}
ImageViewer.prototype.setWrapAround = function(bool){
	this.wrap_mode = bool;
	this.container.trigger('wrapChanged');
}
//state queries
ImageViewer.prototype.canWrap 			= function(){ return this.wrap_mode; }
ImageViewer.prototype.canOpen 			= function(){ return !this.is_open; }
ImageViewer.prototype.canClose 			= function(){ return this.is_open; }
ImageViewer.prototype.isOpen 			= function(){ return this.is_open; }
ImageViewer.prototype.canZoom 			= function(){ return this.is_open && !this.is_zoomed; }
ImageViewer.prototype.canStartSlideShow = function(){ return this.canNext() && !this.is_sliding; }
ImageViewer.prototype.canStopSlideShow 	= function(){ return this.is_open && this.is_sliding; }
ImageViewer.prototype.canSlide 			= function(){ return this.is_open && this.is_sliding; }
ImageViewer.prototype.canUnzoom 		= function(){ return this.is_open && this.is_zoomed; }
ImageViewer.prototype.canPrev 			= function(){ return this.is_open && (this.canWrap() || this.hasPrev()); }
ImageViewer.prototype.canNext 			= function(){ return this.is_open && (this.canWrap() || this.hasNext()); }
ImageViewer.prototype.hasPrev 			= function(){ return this.imageProvider.hasPrev(); }
ImageViewer.prototype.hasNext 			= function(){ return this.imageProvider.hasNext(); }
