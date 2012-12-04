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

	this.optimizeContainerSize();	
	var self = this;
	$(window).on('resize',function(){
		self.optimizeContainerSize();	
		if(self.is_open) self.sizeToFit();
	});
	this.container.on('wrapChanged zoom unzoom slideShowStop slideShowStart open close imageLoaded', function(){
		$imageContainer.trigger('stateChange');
	});
}
//settings (later moved to a public constructor)
//core methods (mutators)
ImageViewer.prototype.optimizeContainerSize = function(){
	this.container.height($(window).height());
	this.containerWidth = this.container.width();
	this.containerHeight = this.container.height(); 
}
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
	if(this.canUnzoom()) this.unzoom();
	this.container.trigger('imageLoaded',image);
}
ImageViewer.prototype.open = function(){
	if(!this.canOpen()) return false;
	var image = this.imageProvider.getFirst();
	this.viewImage(image);
	this.is_open = true;
	this.container.trigger('open');
}
ImageViewer.prototype.close = function(){
	if(!this.canClose()) return false;
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
	if(!this.canSlide()) this.stopSlideShow(); 
	var image = this.imageProvider.getNext();
	this.viewImage(image);
	this.container.trigger('slide');
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
	var ch = this.containerHeight;
	var cw = this.containerWidth;
	//scale the image to fit the available space
	this.image.css({
		'position': 'relative',
		'max-width': cw + 'px',
		'max-height': ch + 'px'
	});
	//center the image horizontally and vertically
	var iw = this.image.width();
	var ih = this.image.height();
	//console.log('width',cw,iw);
	this.image.css({
		'position': 'relative',
		'left': (cw - iw) / 2 + 'px',
		'top': (ch - ih) / 2 + 'px'
	});
}
ImageViewer.prototype.zoom = function(){
	if(!this.canZoom()) return false;
	this.image
		.removeAttr('style')
		.css({
			'position':'absolute',
			'top':0,
			'left':0
		})
	;
	this.is_zoomed = true;
	this.container.trigger('zoom',this.image);
}
ImageViewer.prototype.unzoom = function(){
	if(!this.canUnzoom()) return false;
	this.image.removeAttr('style');
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
ImageViewer.prototype.canClose 			= function(){ return this.is_open && !this.is_sliding; }
ImageViewer.prototype.isOpen 			= function(){ return this.is_open; }
ImageViewer.prototype.canZoom 			= function(){ return this.is_open && !this.is_zoomed && !this.is_sliding; }
ImageViewer.prototype.canStartSlideShow = function(){ return this.canNext() && !this.is_sliding; }
ImageViewer.prototype.canStopSlideShow 	= function(){ return this.is_open && this.is_sliding; }
ImageViewer.prototype.canSlide 			= function(){ return this.is_open && this.is_sliding && this.hasNext(); }
ImageViewer.prototype.canUnzoom 		= function(){ return this.is_open && this.is_zoomed && !this.is_sliding; }
ImageViewer.prototype.canPrev 			= function(){ return this.is_open && this.hasPrev() && !this.is_sliding; }
ImageViewer.prototype.canNext 			= function(){ return this.is_open && this.hasNext() && !this.is_sliding; }
ImageViewer.prototype.hasPrev 			= function(){ return this.imageProvider.hasPrev() || this.canWrap(); }
ImageViewer.prototype.hasNext 			= function(){ return this.imageProvider.hasNext() || this.canWrap(); }
