$(function(){
	//initialize the image pool from the DOM.  hide all original images
	$imageContainer = $('#imageContainer');
	$('img').each(function(){
		var $i = $(this);
		var image = new Image();
		image.src = $i.attr('src');
		images.push($(image));
		$i.remove();
	});
	//window resize listener -> image best-fit
	$(window).on('resize',function(){
		if (current_image) sizeToFit();
	});
	var stateChangeEvents = 'wrapChanged zoom unzoom slideShowStop slideShowStart open close imageLoaded';
	$imageContainer.on(stateChangeEvents, function(){
		$imageContainer.trigger('stateChange');
	});
});
//settings (later moved to a public constructor)
var wrap_mode = true;
var slide_delay = 1000;
//core data
var images = [];
var current_index = 0;
var current_image;
var is_zoomed = false;
var is_sliding = false;
var slideTimeout;
var is_open = false;
var $imageContainer;
//core methods (mutators)
function nextImage(){
	if (!canNext()) return false;
	current_index++;
	if(current_index >= images.length) current_index = 0;
	loadImageFromIndex();
	$imageContainer.trigger('nextImage',current_image);
}
function prevImage(){
	if (!canPrev()) return false;
	current_index--;
	if(current_index < 0) current_index = images.length - 1;
	loadImageFromIndex();
	$imageContainer.trigger('prevImage',current_image);
}
function loadImageFromIndex(){
	if(current_image) current_image.detach();
	current_image = images[current_index];
	current_image.appendTo($imageContainer);	
	sizeToFit();
	$imageContainer.trigger('imageLoaded',current_image);
}
function open(){
	loadImageFromIndex();
	is_open = true;
	$imageContainer.trigger('open');
}
function close(){
	if(current_image) current_image.detach();
	is_open = false;
	$imageContainer.trigger('close');
}
function startSlideShow(){
	if(!canStartSlideShow()) return false;
	console.log('show start!');
	is_sliding = true;
	slideTimeout = setInterval(function(){
		slideNext();
	}, slide_delay);
	$imageContainer.trigger('slideShowStart');
}
function slideNext(){
	if(!canSlide() || !canNext()) stopSlideShow(); 
	nextImage();
}
function stopSlideShow(){
	if(!canStopSlideShow()) return false;
	console.log('show stop!');
	is_sliding = false;
	clearTimeout(slideTimeout);
	$imageContainer.trigger('slideShowStop');
}
function sizeToFit(){
	var wh = $(window).height();
	var ww = $(window).width();
	var ch = $imageContainer.height();
	var cw = $imageContainer.width();
	//scale the image to fit the available space
	current_image.css({
		'max-width': ww + 'px',
		'max-height': wh + 'px'
	});
	//center the image horizontally and vertically
	var ih = current_image.height()
	var iw = current_image.width()
	current_image.css({
		'position': 'absolute',
		'left': (ww - iw) / 2 + 'px',
		'top': (wh - ih) /2 + 'px'
	});
	is_zoomed = false;
}
function zoom(){
	if(!canZoom()) return false;
	current_image.removeAttr('style');
	is_zoomed = true;
	$imageContainer.trigger('zoom',current_image);
}
function unzoom(){
	if(!canUnzoom()) return false;
	sizeToFit();
	is_zoomed = false;
	$imageContainer.trigger('unzoom',current_image);
}
function setWrapAround(bool){
	wrap_mode = bool;
	$imageContainer.trigger('wrapChanged');
}
//state queries
function canSlide(){
	return is_open && is_sliding;
}
function canWrap(){
	return wrap_mode;
}
function isOpen(){
	return is_open;
}
function canZoom(){
	return !is_zoomed && is_open;
}
function canStartSlideShow(){
	return canNext() && !is_sliding;
}
function canStopSlideShow(){
	return is_open && is_sliding;
}
function canUnzoom(){
	return is_zoomed && is_open;
}
function canNext(){
	return is_open && (canWrap() || hasNext()); 
}
function hasNext(){
	return current_index + 1 < images.length;
}
function canPrev(){
	return is_open && (canWrap() || hasPrev()); 
}
function hasPrev(){
	return (current_index - 1) >= 0 && images.length;
}
function canOpen(){
	return !is_open;
}
function canClose(){
	return is_open;
}
