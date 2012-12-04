function ImageViewer(){
	this.wrap_mode = true;
	this.slide_delay = 1000;
	//core data
	this.images = [];
	this.current_index = 0;
	this.current_image;
	this.is_zoomed = false;
	this.is_sliding = false;
	this.slideTimeout;
	this.is_open = false;
	this.$imageContainer;
}
//settings (later moved to a public constructor)
//core methods (mutators)
ImageViewer.prototype.setImages = function(images){
	this.images = images;
	this.imageProvider = new DOMImageProvider();
	this.imageProvider.setImages(images);
};
ImageViewer.prototype.imageCount = function(){
	return this.imageProvider.images.length;
}
ImageViewer.prototype.currentIndex = function(){
	return this.imageProvider.current_index;
}
ImageViewer.prototype.nextImage = function(){
	if (!this.canNext()) return false;
	this.imageProvider.current_index++;
	if(this.imageProvider.current_index >= this.imageProvider.images.length) this.imageProvider.current_index = 0;
	this.loadImageFromIndex();
	this.$imageContainer.trigger('nextImage',this.imageProvider.current_image);
}
ImageViewer.prototype.prevImage = function(){
	if (!this.canPrev()) return false;
	this.imageProvider.current_index--;
	if(this.imageProvider.current_index < 0) this.imageProvider.current_index = this.images.length - 1;
	this.loadImageFromIndex();
	this.$imageContainer.trigger('prevImage',this.imageProvider.current_image);
}
ImageViewer.prototype.loadImageFromIndex = function(){
	if(this.imageProvider.current_image) this.imageProvider.current_image.detach();
	this.imageProvider.current_image = this.imageProvider.images[this.imageProvider.current_index];
	this.imageProvider.current_image.appendTo(this.$imageContainer);	
	this.sizeToFit();
	this.$imageContainer.trigger('imageLoaded',this.imageProvider.current_image);
}
ImageViewer.prototype.open = function(){
	this.loadImageFromIndex();
	this.is_open = true;
	this.$imageContainer.trigger('open');
}
ImageViewer.prototype.close = function(){
	if(this.imageProvider.current_image) this.imageProvider.current_image.detach();
	this.is_open = false;
	this.$imageContainer.trigger('close');
}
ImageViewer.prototype.startSlideShow = function(){
	if(!this.canStartSlideShow()) return false;
	console.log('show start!');
	this.is_sliding = true;
	var self = this;
	slideTimeout = setInterval(function(){
		self.slideNext();
	}, this.slide_delay);
	this.$imageContainer.trigger('slideShowStart');
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
	this.$imageContainer.trigger('slideShowStop');
}
ImageViewer.prototype.sizeToFit = function(){
	min = function(){
		var m;
		for(var i in arguments) if((!m) || arguments[i] < m) m = arguments[i];
		return m;
	}
	var wh = $(window).height();
	var ww = $(window).width();
	console.log(this.$imageContainer);
	var ch = this.$imageContainer.height();
	var cw = this.$imageContainer.width();
	//var w = min(ww,cw);
	//var h = min(wh,ch);
	//console.log('width',ww,cw,w);
	//console.log('height',wh,ch,h);
	//scale the image to fit the available space
	this.imageProvider.current_image.css({
		'max-width': ww + 'px',
		'max-height': wh + 'px'
	});
	//center the image horizontally and vertically
	var ih = this.imageProvider.current_image.height()
	var iw = this.imageProvider.current_image.width()
	this.imageProvider.current_image.css({
		'position': 'absolute',
		'left': (ww - iw) / 2 + 'px',
		'top': (wh - ih) /2 + 'px'
	});
	this.is_zoomed = false;
}
ImageViewer.prototype.zoom = function(){
	if(!this.canZoom()) return false;
	this.imageProvider.current_image.removeAttr('style');
	this.$imageContainer.addClass('zoomed');
	this.is_zoomed = true;
	this.$imageContainer.trigger('zoom',current_image);
}
ImageViewer.prototype.unzoom = function(){
	if(!this.canUnzoom()) return false;
	this.sizeToFit();
	this.is_zoomed = false;
	this.$imageContainer.trigger('unzoom',current_image);
}
ImageViewer.prototype.setWrapAround = function(bool){
	this.wrap_mode = bool;
	this.$imageContainer.trigger('wrapChanged');
}
//state queries
ImageViewer.prototype.canSlide = function(){
	return this.is_open && this.is_sliding;
}
ImageViewer.prototype.canWrap = function(){
	return this.wrap_mode;
}
ImageViewer.prototype.isOpen = function(){
	return this.is_open;
}
ImageViewer.prototype.canZoom = function(){
	return !this.is_zoomed && this.is_open;
}
ImageViewer.prototype.canStartSlideShow = function(){
	return this.canNext() && !this.is_sliding;
}
ImageViewer.prototype.canStopSlideShow = function(){
	return this.is_open && this.is_sliding;
}
ImageViewer.prototype.canUnzoom = function(){
	return this.is_zoomed && this.is_open;
}
ImageViewer.prototype.canNext = function(){
	return this.is_open && (this.canWrap() || this.hasNext()); 
}
ImageViewer.prototype.hasNext = function(){
	return this.imageProvider.current_index + 1 < this.imageProvider.images.length;
}
ImageViewer.prototype.canPrev = function(){
	return this.is_open && (this.canWrap() || this.hasPrev()); 
}
ImageViewer.prototype.hasPrev = function(){
	return (this.imageProvider.current_index - 1) >= 0 && this.imageProvider.images.length;
}
ImageViewer.prototype.canOpen = function(){
	return !this.is_open;
}
ImageViewer.prototype.canClose = function(){
	return this.is_open;
}
