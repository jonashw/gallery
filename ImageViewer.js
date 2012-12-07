function ImageViewer(container,imageProvider){
	this.image;
	//core data
	this.is_zoomed = false;
	this.is_open = false;
	this.container = container;
	this.imageProvider = imageProvider;
	this.observable = new Observable();

	this.optimizeContainerSize();	
	var self = this;
	$(window).on('resize',function(){
		self.optimizeContainerSize();	
		if(self.is_open) self.sizeToFit();
	});
	this.on('zoom unzoom open close imageLoaded', function(){
		self.observable.notifyObservers('stateChange');
	});
}
//settings (later moved to a public constructor)
//core methods (mutators)
ImageViewer.prototype.on = function(event_name, callback){
	this.observable.addObserver(event_name, callback);
	return this;
}
ImageViewer.prototype.optimizeContainerSize = function(){
	this.container.height($(window).height());
	this.containerWidth = this.container.width();
	this.containerHeight = this.container.height(); 
}
ImageViewer.prototype.viewImage = function(image){
	if(this.image) this.image.detach();
	image.appendTo(this.container);	
	this.image = image;
	if(!this.isZoomed()){
		this.sizeToFit();
 	} else {
		this.sizeFull();
	}
	//if(this.canUnzoom()) this.unzoom();
	this.observable.notifyObservers('imageLoaded',image);
}
ImageViewer.prototype.open = function(){
	if(!this.canOpen()) return false;
	var self = this;
	this.imageProvider.getFirst(function(image){
		self.viewImage(image);
		self.is_open = true;
		self.observable.notifyObservers('open');
	});
}
ImageViewer.prototype.close = function(){
	if(!this.canClose()) return false;
	if(this.image) this.image.detach();
	this.is_open = false;
	this.observable.notifyObservers('close');
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
	this.image
		.removeAttr('style')
		.css({
			'position': 'relative',
			'max-width': cw + 'px',
			'max-height': ch + 'px'
		})
	;
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
	this.sizeFull();
	this.is_zoomed = true;
	this.observable.notifyObservers('zoom',this.image);
}
ImageViewer.prototype.sizeFull = function(){
	this.image
		.removeAttr('style')
		.css({
			'position':'absolute',
			'top':0,
			'left':0
		})
	;
}
ImageViewer.prototype.unzoom = function(){
	if(!this.canUnzoom()) return false;
	this.image.removeAttr('style');
	this.sizeToFit();
	this.is_zoomed = false;
	this.observable.notifyObservers('unzoom',this.image);
}
//state queries
ImageViewer.prototype.canOpen 	= function(){ return !this.is_open; };
ImageViewer.prototype.canClose 	= function(){ return this.is_open; };
ImageViewer.prototype.isOpen 	= function(){ return this.is_open; };
ImageViewer.prototype.isZoomed	= function(){ return this.is_zoomed; };
ImageViewer.prototype.canZoom 	= function(){ return this.is_open && !this.is_zoomed; };
ImageViewer.prototype.canUnzoom = function(){ return this.is_open && this.is_zoomed; };
