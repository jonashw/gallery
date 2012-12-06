$(function(){
	var controls = $("#controls");
	var openBtn = $("#open");
	var closeBtn = $("#close");
	var prevBtn = $("#prev");
	var nextBtn = $("#next");
	var zoomBtn = $("#zoom");
	var unzoomBtn = $("#unzoom");
	var hud = $("#hud").hide();
	var wrapCheck = $("#wrap");
	var start = $("#slideshow-start");
	var stop = $("#slideshow-stop");
	updateUIState();
	openBtn.on('click',function(){
		viewer.open();
	});
	closeBtn.on('click',function(){
		viewer.close();
	});
	prevBtn.on('click',function(){
		viewer.prevImage();
	});
	nextBtn.on('click',function(){
		viewer.nextImage();
	});
	zoomBtn.on('click',function(){
		viewer.zoom();
	});
	unzoomBtn.on('click',function(){
		viewer.unzoom();
	});
	wrapCheck.on('change',function(){
		viewer.setWrapAround($(this).is(':checked'));
	});
	start.on('click',function(){
		player.start();
	});
	stop.on('click',function(){
		player.stop();
	});
	$imageContainer
		.on('imageLoaded',function(e,image){
			//console.log(image);
			hud.text('Viewing ' + (viewer.currentIndex() + 1) + ' of ' + viewer.imageCount());
		})
		.on('open',function(){
			//console.log('open detected');
		})
		.on('stateChange slideShowStart slideShowStop',function(){
			//console.log('detected state change');
			//console.log(viewer.canOpen());
			updateUIState();
		})
		.on('click','img',function(e){
			viewer.canZoom() ? viewer.zoom() : viewer.unzoom();
		})
		.on('zoom',function(){
			controls.hide();
		})
		.on('unzoom',function(){
			controls.show();
		})
	;
	//keyboard navigation listener (arrow keys)
	$(document).on('keydown',function(e){
		console.log(e.which);
		switch(e.which){
			case 39://right
				viewer.nextImage();
				e.preventDefault();
				break;
			case 37: //left
				viewer.prevImage();
				e.preventDefault();
				break;
			case 38: //up	
				viewer.zoom();	
				break;
			case 40: //down
				viewer.unzoom();
				break;
			case 27: //esc
				viewer.close();
				break;
			case 13: //enter
				viewer.open();
				break;
		}
	})
	//core UI functions
	function setEnabledTo($el,b){
		if(b){
			$el.removeAttr('disabled');
		} else {
			$el.attr('disabled','true');
		}
	}
	function setShownTo($el,b){
		if(b){
			$el.show();
		} else {
			$el.hide();
		}
	}
	function setChecked($el,b){
		if(b){
			$el.prop('checked',true);
		} else {
			$el.prop('checked',false);
		}
	}
	function updateUIState(){
		setEnabledTo(closeBtn, viewer.canClose());
		setEnabledTo(openBtn, viewer.canOpen());
		setEnabledTo(zoomBtn, viewer.canZoom());
		setEnabledTo(unzoomBtn, viewer.canUnzoom());
		setEnabledTo(prevBtn, viewer.canPrev() && !player.isPlaying());
		setEnabledTo(nextBtn, viewer.canNext() && !player.isPlaying());
		setEnabledTo(start, player.canStart());
		setEnabledTo(stop, player.canStop() && player.isPlaying());
		setShownTo(hud, viewer.isOpen());
		setChecked(wrapCheck, viewer.canWrap());
	}
});
