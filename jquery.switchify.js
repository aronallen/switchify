(function($) {
    $.fn.switchify = function(_options, callback) {
	
		//browser detect from http://www.quirksmode.org/js/detect.html
		var BrowserDetect={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS";},searchString:function(data){for(var i=0;i<data.length;i++){var dataString=data[i].string;var dataProp=data[i].prop;this.versionSearchString=data[i].versionSearch||data[i].identity;if(dataString){if(dataString.indexOf(data[i].subString)!=-1)
return data[i].identity;}
else if(dataProp)
return data[i].identity;}},searchVersion:function(dataString){var index=dataString.indexOf(this.versionSearchString);if(index==-1)return;return parseFloat(dataString.substring(index+this.versionSearchString.length+1));},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};BrowserDetect.init();
	
		var switchify = this;
	
		if(typeof callback === 'undefined'){
			callback = function(state){ 
				//callback example.
			}
		}

        if (!switchify.data('switchify:elements') || !switchify.data('switchify:options') || _options) {
	        
			elements = {};
			
            switchify.addClass("switchify");


			var defualt_options = {
            	size: 44,
            	strings: {
                	on: "ON",
                	off: "OFF"
            	},
            	state: true,
            	shading: true,
				rounded: true,
				clickable: true
            }

			if(!switchify.data('switchify:options')){
				switchify.data('switchify:options', defualt_options);
			}
			
			if(!switchify.data('switchify:elements')){
				switchify.data('switchify:elements', {});
			}
			
			
			$.extend(true, switchify.data('switchify:options'), _options);
			
			
        }

		var elements = switchify.data('switchify:elements');
		var options = switchify.data('switchify:options');
		var browser = BrowserDetect.browser;
		
		
		if(options.size < 20){
			options.size = 20;
			console.log("switchify: can't make switch smaller than 20px, forcing switch to 20px size")
		}
		
		if(browser === 'Opera' && options.rounded){
			console.log('switchify: sorry, but opera renders the rouded switch incorrectly, forcing a non rounded switch');
			options.rounded = false;
		}
		
		



        this.functions = {

            render: function() {
								
				switchify.empty();

                var view = this;

                elements.inner = $('<div>', {
                    'class': 'inner'
                });

                switchify.append(elements.inner);


				var touch_events = 'touchmove touchend touchstart';
				var mouse_events = 'mousedown mousemove mouseup click';
				
				switchify.unbind(touch_events +  ' ' + mouse_events);
                switchify.bind(touch_events +  ' ' + mouse_events,
                function(event) {
                    view.move(event, this);
                    event.preventDefault();
                });


                elements.inner.append($('<div>', {
                    'class': 'on option'
                }).append('<p>' + options.strings.on));

                elements.peg = $('<div>', {
                    'class': 'peg'
                });
                elements.inner.append(elements.peg);

                elements.inner.append($('<div>', {
                    'class': 'off option'
                }).append('<p>' + options.strings.off));


				

                this.css();

            },


            css: function() {

                switchify.css({
                    '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
                });



                $(".off p", elements.inner).css({
                    'padding-left': options.size/1.333,
                    'padding-right': options.size/4,
                    'float': 'left'
                });
                $(".on p", elements.inner).css({
                    'padding-right': options.size/1.333,
                    'padding-left': options.size/4,
                    'float': 'right'
                });


				//Baseline fixing
				if(browser === 'Opera'){
					$("p", elements.inner).css({'top' : '6%', 'position' : 'relative'});
				}
				if(browser === 'Firefox'){
					$("p", elements.inner).css({'top' : '3.97%', 'position' : 'relative'});
				}

                //Round corners
                if (options.rounded) {
                    elements.peg.css({
                        'border-radius': options.size / 2
                    });
                    switchify.css({
                        'border-radius': options.size / 2
                    });



                    //The padding is to pseudo center the text, so it appears centered, add border radius as well
                    $(".off", elements.inner).css({
                        'border-top-right-radius': options.size / 2,
                        'border-bottom-right-radius': options.size / 2
                    });
                    $(".on", elements.inner).css({
                        'border-top-left-radius': options.size / 2,
                        'border-bottom-left-radius': options.size / 2
                    });


                    $(".off p", elements.inner).css({
                        'padding-right': options.size / 2,
                    });
                    $(".on p", elements.inner).css({
                        'padding-left': options.size / 2,
                    });



                }

                if (options.shading) {

                    //Apply shading on elements.peg
                    elements.peg.css({
                        'box-shadow': 'inset 0px 1px 1px rgba(255,255,255,1)',
                        'background-image': '-webkit-gradient(linear, right bottom, right top, from(rgba(255,255,255,.0)), to(rgba(255,255,255,1)))',
                    });

                    //For Firefox
                    if (elements.peg.css('background-image') === 'none') {
                        elements.peg.css('background-image', '-moz-linear-gradient(bottom, rgba(255,255,255,.0), rgba(255,255,255,1))')
                    }

					if (elements.peg.css('background-image') === 'none') {
                        elements.peg.css('background-image', '-o-linear-gradient(bottom, rgba(255,255,255,.0), rgba(255,255,255,1))')
                    }

                    //Apply shading on options				
                    $(".option", elements.inner).css({
                        'box-shadow': 'inset 0px 0px 10px rgba(0,0,0,.5)',
                        'background-image': '-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,.3)), to(rgba(0,0,0,.0)))',
                        'text-shadow': '0px -1px 0px rgba(0,0,0,.5)'
                    });

                    //For Firefox
                    if ($(".option", elements.inner).css('background-image') === 'none') {
                        $(".option", elements.inner).css('background-image', '-moz-linear-gradient(top, rgba(0,0,0,.3), rgba(0,0,0,.0))')
                    }

					//For Opera
					if ($(".option", elements.inner).css('background-image') === 'none') {
                        $(".option", elements.inner).css('background-image', '-o-linear-gradient(top, rgba(0,0,0,.3), rgba(0,0,0,.0))')
                    }


                }


                //Set the size of the main element		
                switchify.height(options.size);

                //Set the width of the elements.peg
                elements.peg.width(options.size);
                elements.peg.height(options.size);

                //Set the elements.peg CSS
                elements.peg.css({
                    'position': 'relative',
                    'z-index': 2
                })


                elements.peg.css({
                    'margin': '0px -' + (options.size / 2) + 'px'
                });


                //2 units to show one option, a half to show the elements.peg

                //Set the font size of the option labels
                $("p", elements.inner).css('font-size', (options.size / 2) + 'px');
                $("p", elements.inner).css('line-height', (options.size / 2) + 'px');

                $("p", elements.inner).css('padding-top', (options.size / 4) + 'px');
                $("p", elements.inner).css('padding-bottom', (options.size / 4) + 'px');

                $("p", elements.inner).css('height', options.size + 'px');


				var off_w = $(".option.off", elements.inner).width();
				var on_w  = $(".option.on", elements.inner).width();
				
				
				var widest = (off_w > on_w) ? off_w : on_w;

                $(".option", elements.inner).width(widest);

				elements.inner.width(widest * 2);
				

				options.width = $(".option", elements.inner).width() - elements.peg.width()/2;
				switchify.width(elements.peg.width()/2 + $(".option", elements.inner).width());
				
				
				
				
                this.toggle(false);

            },

            move: function(event) {
                orgEvent = event.originalEvent;

				var point;
				
				var that = this;



                //show both options
                this.show_all_options();

				if(orgEvent.touches){
					point = orgEvent.touches[0];
				}else{
					point = event;
				}

                //unbind the transition end, to avoid items hiding unintendedly

                switch (event.type) {
				case 'mousedown':
                case 'touchstart':
                	elements.inner.unbind('webkitTransitionEnd transitionend');
                    options.org_x = point.screenX;
					options.mouse_down = true;
					$(document).one('mouseup', function(event){
						options.mouse_down = false;
						
						//find the switch from the target element
						var s = ($(event.target).hasClass("switchify")) ? $(event.target) : $(event.target).parents(".switchify");
						
						//if the switch was not found, we call mouse up to force the interaction to end
						if(s.length === 0) that.move(event)
					});
					
                    break;
				case 'mousemove':
					if (!options.mouse_down) break;
                case 'touchmove':
                    if (options.org_x) {
	

                        if (options.state === true) {
                            options.diff_x = point.screenX - options.org_x;
                        } else {
                            options.diff_x = -options.width - (options.org_x - point.screenX);
                        }

                        if (options.diff_x > 0) {
                            options.diff_x = 0;
                        }

                        if (options.diff_x < -options.width) {
                            options.diff_x = -options.width;

                        }

                        event.preventDefault();

                        this.translate(options.diff_x);

                    }
                    break;
                case 'touchend':
				case 'mouseup':
					options.mouse_down = false;
				
                    if (options.diff_x < -options.width / 2 && options.state) {
                        options.state = false;
                    } else if ((options.diff_x > (- options.width / 2)) && !options.state) {
                        options.state = true;
                    }

                    if (options.diff_x === undefined && options.clickable) {
                        options.state = !options.state;
                    }

                    this.toggle(true);
	                options.diff_x = undefined;
                    break;
                }


            },


			

            toggle: function(animate) {

                var that = this;


				var transition_end =  function(that){
					return function(){
						elements.inner.removeClass('animate');
                        that.hide_unselected_option();
						callback(options.state);
					}
				}

                var diff;

                if (options.state === true) {
                    diff = 0;
                } else {
                    diff = -options.width;
                }

                if (animate) {
                    elements.inner.addClass('animate');
                    elements.inner.unbind('webkitTransitionEnd transitionend');
                    elements.inner.bind('webkitTransitionEnd transitionend', transition_end(this));
                } else {
                    this.hide_unselected_option();
					if(!options)
					callback(options.state);
                }
                this.translate(diff);

            },

            hide_unselected_option: function() {	
                if (options.state) {
                    $(".off", elements.inner).css('opacity', 0.0);
                } else {
                    $(".on", elements.inner).css('opacity', 0.0);
                }
            },

            show_all_options: function() {
                $(".on", elements.inner).css('opacity', 1);
                $(".off", elements.inner).css('opacity', 1);
            },

            translate: function(x) {
	
	
																
				switch (browser) {

					case 'Chrome':
					case 'Safari':
						//some bug in WebKit casues the border radius clip to fail on transformed child elements.
						//if the div is rounded, use margin left, else use the trasnform
						if(!options.rounded){
							elements.inner.css({
			                    '-webkit-transform': 'translate3d(' + (x) + 'px, 0px, 0px)',
			                });
							break;
						}
					case 'Firefox':
						if(document.body.style.MozTransform !== undefined){							
							elements.inner.css({
			                	'-moz-transform': 'translateX(' + (x) + 'px)',
			            	});
							break;
						}
					case 'Opera':
						if(!options.rounded){
							elements.inner.css({
		                		'-o-transform': 'translateX(' + (x) + 'px)',
		            		});
							break;
						}
					default:
						elements.inner.css({
							'margin-left' : x
						});
						break;
				}
            }
        }

        this.functions.render(this);  
		return this;
      
    };
})(jQuery);