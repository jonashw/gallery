function ImageProvider(){}
ImageProvider.prototype.hasNext = function(){};
ImageProvider.prototype.hasPrev = function(){};
ImageProvider.prototype.getNext = function(){};
ImageProvider.prototype.getPrev = function(){};
ImageProvider.prototype.getImageCount = function(){};
ImageProvider.prototype.getCurrentIndex = function(){return this.current_index;};

//DOMImageProvider: Uses a collection of images already loaded in the DOM
DOMImageProvider.prototype = new ImageProvider();
function DOMImageProvider($images){
	this.current_index = null;
	var images = [];
	$images.each(function(){
		var $i = $(this);
		var image = new Image();
		image.src = $i.attr('src');
		images.push($(image));
		$i.detach();
	});
	this.images = images;
}
DOMImageProvider.prototype.hasNext = function(){
	return this.current_index + 1 < this.images.length;
};
DOMImageProvider.prototype.hasPrev = function(){
	return (this.current_index - 1) >= 0 && this.images.length > 0;
};
DOMImageProvider.prototype.getFirst = function(){
	this.current_index = 0;
	return this.images[this.current_index];
};
DOMImageProvider.prototype.getNext = function(callback){
	this.current_index++;
	if(this.current_index >= this.images.length) this.current_index = 0;
	callback(this.images[this.current_index]);
};
DOMImageProvider.prototype.getPrev = function(callback){
	this.current_index--;
	if(this.current_index < 0) this.current_index = this.images.length - 1;
	callback(this.images[this.current_index]);
};
DOMImageProvider.prototype.getImageCount = function(){
	return this.images.length;
};


//LazyImageProvider: Uses a list of URLs, loading images from the URLs on demand.
//	Image elements are stored in a cache once loaded.
LazyImageProvider.prototype = new ImageProvider();
function LazyImageProvider(urls){
	this.current_index = null;
	this.urls = urls;
}
LazyImageProvider.prototype.hasNext = function(){
	return this.current_index + 1 < this.urls.length;
};
LazyImageProvider.prototype.hasPrev = function(){
	return (this.current_index - 1) >= 0 && this.urls.length > 0;
};
LazyImageProvider.prototype.getFirst = function(callback){
	this.current_index = 0;
	return this.getCurrentImage(callback);
};
LazyImageProvider.prototype.getNext = function(callback){
	this.current_index++;
	if(this.current_index >= this.urls.length) this.current_index = 0;
	this.getCurrentImage(callback);
};
LazyImageProvider.prototype.getPrev = function(callback){
	this.current_index--;
	if(this.current_index < 0) this.current_index = this.urls.length - 1;
	this.getCurrentImage(callback);
};
LazyImageProvider.prototype.getCurrentImage = function(callback){
	return this.getImageFromURL(this.urls[this.current_index],callback);
};
LazyImageProvider.prototype.getImageFromURL = function(url,callback){
	var image;
	var fn = this.getImageFromURL;	
	if(!('imageCache' in fn)) fn.imageCache = {};
	if(url in fn.imageCache){
		image = fn.imageCache[url];
		//console.log('loaded img from cache');
	} else {
		image = $('<img>')
			.attr('src',url)
			.hide()
			.appendTo($(document.body))
			.detach()
			.show()
		;
		fn.imageCache[url]=image;
		//console.log('loaded img from url: ' + url + ' (added to cache)');
	}
	callback(image);
};
LazyImageProvider.prototype.getImageCount = function(){
	return this.urls.length;
};
