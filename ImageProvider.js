function ImageProvider(){}
ImageProvider.prototype.hasNext = function(){};
ImageProvider.prototype.hasPrev = function(){};
ImageProvider.prototype.getNext = function(){};
ImageProvider.prototype.getPrev = function(){};

DOMImageProvider.prototype = new ImageProvider();
function DOMImageProvider($images){
	this.current_index = 0;
	this.current_image;
	/*
	var images = [];
	$images.each(function(){
		var $i = $(this);
		var image = new Image();
		image.src = $i.attr('src');
		images.push($(image));
		$i.detach();
	});
	*/
}
DOMImageProvider.prototype.setImages = function(images){this.images=images;};
DOMImageProvider.prototype.hasNext = function(){};
DOMImageProvider.prototype.hasPrev = function(){};
DOMImageProvider.prototype.getNext = function(){};
DOMImageProvider.prototype.getPrev = function(){};
