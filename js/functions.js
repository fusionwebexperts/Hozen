"use strict";

/* Mute the page header background video */
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer', {
    events: {
      'onReady': function() {
		player.mute()
      },
    }
  });
}

jQuery(function($) { 
	var isMobile = false;
	$.support.placeholder = ('placeholder' in document.createElement('input'));

	/* Form Texts */
	var validationError = 'Validation errors occurred. Please confirm the fields and submit it again.',
		emailError = 'Please enter a valid email address.',
		requiredError = 'Please fill the required field.',
		successText = 'Email successfuly sent.',
		errorText = 'An error occurred - email not sent seccessfuly.';

	/* Screen size (grid) */
	var	screenLarge = 1200,
		screenMedium = 992,
		screenSmall = 768;

	/* Check if on mobile */
	if(/Mobi/.test(navigator.userAgent)) {
		isMobile = true;
	}

	/*-----------------------------------------------------------------------------------*/
	/*	Contact Form
	/*-----------------------------------------------------------------------------------*/

	/* Form Validation */

	function validateContact() {

		var valid = true;	
		$('.contact-form input, .contact-form textarea').removeClass('alert');
		$('.contact-form label, .contact-form .info').html('');
		
		/* Check valid email */
		$('.contact-form input[type="email"], .contact-form input[name="email"]').each(function() {
			if( !$(this).val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/) ) {
				$(this).next('label').html(emailError);
				$(this).addClass('alert');
				valid = false;
			}
		});

		/* Check required */
		$('.contact-form input[required], .contact-form textarea[required]').each(function() {
			if( !$(this).val() || (!$.support.placeholder && $(this).val() == $(this).attr('placeholder')) ) {
				$(this).next('label').html(requiredError);
				$(this).addClass('alert');
				valid = false;
			}
		});

		return valid;
	}

	/* Form Submit */

	$('.contact-form').on('submit',(function(e) {
		e.preventDefault();

		$('.contact-form .spinner').removeClass('hidden');

		if( validateContact() ) {
			$.ajax({
				url: "./php/email.php",
				type: "POST",
				data: $(this).serialize(),
				success: function(data) {
					$('.info').html(data);
					$('.contact-form .spinner').addClass('hidden');
					$('.contact-form .info').html('<div class="alert alert-success"><button aria-hidden="true" data-dismiss="alert" class="close" type="button"><i class="fa fa-remove"></i></button><i class="fa fa-check"></i>' + successText + '</div>');
				},
				error: function() {
					$('.contact-form .spinner').addClass('hidden');
					$('.contact-form .info').html('<div class="alert alert-danger"><button aria-hidden="true" data-dismiss="alert" class="close" type="button"><i class="fa fa-remove"></i></button><i class="fa fa-exclamation"></i> ' + errorText + '</div>');
				} 	        
			});
		} else {
			$('.contact-form .info').html('<div class="alert alert-danger-style-2"><button aria-hidden="true" data-dismiss="alert" class="close" type="button"><i class="fa fa-remove"></i></button><i class="fa fa-exclamation"></i> ' + validationError + '</div>');
			$('.contact-form .spinner').addClass('hidden');
		}
	}));

	/*-----------------------------------------------------------------------------------*/
	/*	Recent News
	/*-----------------------------------------------------------------------------------*/

	var owl = $('.recent-news .owl-carousel');
    $(owl).owlCarousel({ 
        loop: true,
        margin: 30,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                slideBy: 1
            },
            500: {
                items: 2,
                slideBy: 2
            },
            992: {
                items: 3,
                slideBy: 3
            }
        }
    });

    /* Recent News Navigation */
    $('.recent-news .owlnext').on('click', function(){
		owl.trigger('next.owl.carousel');
    });

    $('.recent-news .owlprev').on('click', function(){
		owl.trigger('prev.owl.carousel');
    });

	/*-----------------------------------------------------------------------------------*/
	/*	Testimonials
	/*-----------------------------------------------------------------------------------*/

    $('.testimonials .owl-carousel').each(function() {
    	var el = $(this);
	    var owlSettings = {
			loop:false,
	        margin: 0,
	        responsiveClass:true,
	        mouseDrag: false,
	        touchDrag: false,
	        responsive:{
	            0:{
	                items: 1,
	                nav: false,
	                slideBy: 1
	            }
	        }
	    }

	    if( el.children('li').length > 1 ) {
	    	owlSettings.loop = true;
	    	owlSettings.navigation = true;
	    	owlSettings.mouseDrag = true;
	    	owlSettings.touchDrag = true;
	    }

	    el.owlCarousel(owlSettings);

	    // Custom Navigation Events
	    el.parents('.testimonials').find('.owlnext').on('click', function(){
	    	el.trigger('next.owl.carousel');
	    });

	    el.parents('.testimonials').find('.owlprev').on('click', function(){
	    	el.trigger('prev.owl.carousel');
	    });
    });

	/*-----------------------------------------------------------------------------------*/
	/*	Projects
	/*-----------------------------------------------------------------------------------*/

	/* Reset Pagination */

	function resetPagination(items, itemClass, perPage) {
		var pageTemp = 0;

		items.find(itemClass).each(function(item) {
			var tempClass = $(this).attr('class');

			$(this).attr('class', tempClass.replace(/(page-[1-9][0-9]*)/g, ''));
		});
		
		items.find(itemClass).each(function(index) {
			if( index % perPage === 0 ) {
				pageTemp += 1;
			}

			items.find(itemClass).eq(index).addClass('page-' + pageTemp);
		});
	}

	/* Main logic */

	window.onload = function() {
		$('.projects').each(function() {
			var items = $(this).find('.projects-content');
			var itemClass = '.projects-item';
			var filter = $(this).find('.filter');
			var initialFilter = '';
			var hash = window.location.hash.replace('#', '');

			if( hash && filter.find('[data-filter="' + hash + '"]').length ) {
				initialFilter = '.' + hash;
				filter.find('.selected').removeClass('selected');
				filter.find('[data-filter="' + hash + '"]').addClass('selected');
			}

			if( $(this).find('.projects-pagination').length ) {
				var pageNum = 1;
				var perPage = 3;
				var numPages = Math.ceil(items.find(itemClass).length / perPage);

				if( window.innerWidth < screenSmall ) {
					perPage = 2;
				} else if( window.innerWidth < screenMedium ) {
					perPage = 4;
				} else if ( items.find(itemClass).hasClass('col-md-3') ) {
					perPage = 4;
				}

				if( numPages < 2 ) {
					$('.projects-pagination').hide();
				} else {
					$('.projects-pagination').show();
				}

				$(window).on('resize', function() {
					if( window.innerWidth < screenSmall ) {
						perPage = 2;
					} else if( window.innerWidth < screenMedium ) {
						perPage = 4;
					} else if ( items.find(itemClass).hasClass('col-md-3') ) {
						perPage = 4;
					} else {
						perPage = 3;
					}

					filter.find('.selected').click();
				});

				resetPagination(items, itemClass, perPage);

				/* Layout */
				items.isotope({
					itemSelector: itemClass,
					layoutMode  : 'fitRows',
					filter      : '.page-' + pageNum + initialFilter,
					transitionDuration: '.3s',
					hiddenStyle: {
						opacity: 0,
					},
					visibleStyle: {
						opacity: 1,
					}
				});

				/* Filtering */
				filter.find('button').on('click', function(e) {
					var value = $(this).attr('data-filter');
					value = (value != '*') ? '.' + value : value;
					pageNum = 1;
					
					numPages = Math.ceil(items.find(itemClass + value).length / perPage);

					if( numPages < 2 ) {
						$('.projects-pagination').hide();
					} else {
						$('.projects-pagination').show();
					}

					resetPagination(items, itemClass + value, perPage)
					items.isotope({ filter: value + '.page-1' });

					/* Change select class */
					filter.find('.selected').removeClass('selected');
					$(this).addClass('selected');
				});

				$('.projects-pagination button').on('click', function() {
					var value = $('.filter .selected').attr('data-filter');
					value = (value != '*') ? '.' + value : value;

					if( $(this).hasClass('prev') ) {
						if( pageNum - 1 == 0 ) {
							pageNum = numPages;
						} else {
							pageNum -= 1;
						}
					} else {
						if( pageNum + 1 > numPages ) {
							pageNum = 1;
						} else {
							pageNum += 1;
						}
					}

					items.isotope({ filter: value + '.page-' + pageNum });
				});
			} else {
				/* Layout */
				items.isotope({
					itemSelector: itemClass,
					layoutMode  : 'fitRows',
					filter      : initialFilter,
				});

				/* Filtering */
				filter.find('button').on('click', function(e) {
					var value = $(this).attr('data-filter');
					value = (value != '*') ? '.' + value : value;
					
					items.isotope({ filter: value });

					/* Change select class */
					filter.find('.selected').removeClass('selected');
					$(this).addClass('selected');
				});
			}
		});
	}

	/*-----------------------------------------------------------------------------------*/
	/*	Main menu
	/*-----------------------------------------------------------------------------------*/

	/* Add Support for touch devices for desktop menu */
	$('#main-menu').doubleTapToGo();

	function moveNav() {
		/* Create ghost-na-wrap if it doesn't exist */
		if ( !$('.ghost-nav-wrap').length ) {
			$('body').prepend('<div class="ghost-nav-wrap empty site-navigation"></div>')
		}

		if ( (window.innerWidth < screenLarge) && $('.ghost-nav-wrap').hasClass('empty') ) {
			/* Mobile */
	    	$("nav.site-navigation .mobile-wrap").detach().appendTo('.ghost-nav-wrap');
	    	$('.ghost-nav-wrap').removeClass('empty');
	    	$('.menu-item-has-children').each(function(){
				$( "> ul", this ).hide();
				$('.megamenu').hide();
			});
	    } else if ( (window.innerWidth > screenLarge - 1) && !$('.ghost-nav-wrap').hasClass('empty') ) {
	    	/* Desktop */
	    	$('.ghost-nav-wrap .mobile-wrap').detach().appendTo('nav.site-navigation');
	    	$('.ghost-nav-wrap').addClass('empty');
	    	$('.menu-item-has-children').each(function(){
				$( '> ul', this ).show();
				$('.megamenu').show();
			});
	    }

	    /* Reset if mobile nav is open and window is resized to desktop mode */
	    if ((window.innerWidth > screenLarge - 1) && $('html').hasClass('show-menu')) {
	    	$('.burger').toggleClass('active');
	    	$('html').removeClass('show-menu');
	    }
	} 

	moveNav();
	$( window ).resize(function() {
		moveNav();
		if ($('body').hasClass('stickyheader')) {
			setSticky();
		}
	});

	$('.burger').on('click', function() { 
	    $(this).toggleClass('active');
	    $(window).scrollTop(0);
	    $(this).blur();

	    $('html').toggleClass('show-menu');

	    $(document).trigger('resize');

	    /* Fix Revolution Slider issue */
	    if( $('.rev_slider').length ) {
	    	$('.rev_slider').revredraw();
	    }

	    /* Fix Revolution Slider FS issue */
	    if( $('.forcefullwidth_wrapper_tp_banner').length ) {
	    	$('.rev_slider_wrapper').css({
	    		left: 0
	    	});
	    }
	});

	$('.menu-item-has-children').each(function(){
		$(this).append('<span class="mobile-showchildren"><i class="fa fa-angle-down"></i></span>');
	});

	$(".mobile-showchildren").on('click', function(){
		$(this).siblings("ul, .megamenu").toggle('300');
	});

	function setSticky() {
		var topbarHeight = 0,
			headerHeight = 0;

		if ( $('.top-bar').length ) {
			topbarHeight = $('.top-bar').outerHeight();
		}
		if ( $('.site-header').length && !$('header.bottom').length ) {
			headerHeight = $('.site-header').outerHeight();
		}	

		var offset = topbarHeight + headerHeight;

		if( $('header.bottom').length ) {
			offset += $(window).innerHeight();
		}

		if (window.innerWidth > screenLarge - 1) {
			var headerwaypoint = new Waypoint({
				element: $('body'),
				handler: function(direction) {
					if ((direction == 'down') && (window.innerWidth > screenLarge - 1)) {
						$('.site-header').css('opacity', '0');
						$('.site-header').addClass('sticky');
						$('.site-header').animate({opacity:1});
						if(!$('.site-header').hasClass('transparent')){
							$('.site-main').css('padding-top', headerHeight + 'px' );
						}				
					} else if ($('.site-header').hasClass('sticky')) {
						$('.site-header').removeClass('sticky');
						$('.site-main').css('padding-top', '0' );
					}
					
				},
				offset: -offset
			})
		} 
	}

	if ( $('body').hasClass('stickyheader') ) {
		setSticky();
	}

	/* Menu search */

	$('.menu-search-toggle').on('click', function() {
		$('.menu-search-form').toggleClass('hide');
		$(this).blur();
	});

	/*-----------------------------------------------------------------------------------*/
	/*	Gallery Thumbnails
	/*-----------------------------------------------------------------------------------*/

	var openGallery = false;

	function changeThumb(el) {
		if( !el.hasClass('selected') ) {
			$('.gallery-fs > figure > img').attr('src', el.attr('href'));
			$('.gallery-fs > figure > figcaption').html(el.attr('title'));
			$('.gallery-fs-thumbnails .selected').removeClass('selected');
			el.addClass('selected');
		}		
	}

	var thumbCol = 6;
	var galleryParent = $('.gallery-fs').parents('[class*="col-"]');
	var galleryParentSize = Math.floor(galleryParent.outerWidth() / galleryParent.parent().outerWidth() * 100);

	if( galleryParentSize < 60 ) { thumbCol = 5; }
	if( galleryParentSize == 100 ) { thumbCol = 9; }
	
	$('.gallery-fs-thumbnails').owlCarousel({
	    loop: false,
	    margin: 17,
	    nav: true,
	    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
	    responsive: {
	        0:    { items: 2 },
	        600:  { items: 4 },
	        1000: { items: thumbCol },
	    },
	});

	$('.gallery-fs-thumbnails a').swipebox({
		hideBarsDelay : -1,
		afterOpen: function() {
			if( !openGallery ) {
				$.swipebox.close();
			}
			openGallery = false;
		},
		nextSlide: function() {
			var index = $('.gallery-fs-thumbnails .owl-item a.selected').parent().index();

			if( index < $('.gallery-fs-thumbnails .owl-item').length - 1 ) {
				changeThumb($('.gallery-fs-thumbnails .owl-item').eq(index+1).children('a'));
			}
		},
		prevSlide: function() {
			var index = $('.gallery-fs-thumbnails .owl-item a.selected').parent().index();

			if( index > 0 ) {
				changeThumb($('.gallery-fs-thumbnails .owl-item').eq(index-1).children('a'));
			}
		},
	});

	$('.gallery-fs-thumbnails .owl-item a').on('click', function() {
		changeThumb($(this));
	});

	$('.gallery-fs-fullscreen').on('click', function() {
		openGallery = true;

		if( $('.gallery-fs-thumbnails').length ) {
			$('.gallery-fs-thumbnails .owl-item a.selected').eq(0).click();
		}
	});

	/* Only one thumbnail */

	if( !$('.gallery-fs-thumbnails').length ) {
		$('.gallery-fs-fullscreen').css({
			'right': '21px'
		});
		$('.gallery-fs-fullscreen').swipebox({ hideBarsDelay : 1 })
	}

	/* Gallery */

	$('.gallery a').swipebox({
		hideBarsDelay : -1,
	});

	/*-----------------------------------------------------------------------------------*/
	/*	Fixed Footer
	/*-----------------------------------------------------------------------------------*/

	if( $('.fixed-footer').length ) {
		fixedFooter();

		$(window).resize(function() {
			fixedFooter();
		});
	}

	function fixedFooter() {
		$('.site-main').css('margin-bottom', $('.site-footer').innerHeight());
	}

	/*-----------------------------------------------------------------------------------*/
	/*	Quantity field
	/*-----------------------------------------------------------------------------------*/

	$('.quantity input[type="button"]').on('click', function(e) {
		var field = $(this).parent().find('.quantity-field'),
			val = parseInt(field.val(), 10),
			step = parseInt(field.attr('step'), 10),
			min = parseInt(field.attr('min'), 10),
			max = parseInt(field.attr('max'), 10);

		if( $(this).val() === '+' && (val < max || !max) ) {
			/* Plus */
			field.val(val + step);
		} else if ( $(this).val() === '-' && val > min ) {
			/* Minus */
			field.val(val - step);
		}
	});

	/*-----------------------------------------------------------------------------------*/
	/*	Featured Element (lightbox)
	/*-----------------------------------------------------------------------------------*/

	$('.featured-video .featured-header a, .featured-image .featured-header a').swipebox({ hideBarsDelay : 1 });

	/*-----------------------------------------------------------------------------------*/
	/*	IE9 Placeholders
	/*-----------------------------------------------------------------------------------*/

	if (!$.support.placeholder) {
		$('[placeholder]').on('focus', function () {
			if ($(this).val() == $(this).attr('placeholder')) {
				$(this).val('');
			}
		}).on('blur', function() {
			if($(this).val() == "") {
				$(this).val($(this).attr('placeholder'));
			}
		}).blur();

		$('[placeholder]').parents('form').on('submit', function () {
			if( $('[placeholder]').parents('form').find('.alert') ) { return false; }

			$(this).find('[placeholder]:not(.alert)').each(function() {
				if ($(this).val() == $(this).attr('placeholder')) {
					$(this).val('');
				}
			});
		});
	}

	/*-----------------------------------------------------------------------------------*/
	/*	Page Header
	/*-----------------------------------------------------------------------------------*/

	function pageHeaderVideoSize() {
		$(".page-header iframe").height($(window).width()/1.77777777778);
	}

	if( $('.page-header').length ) {
		pageHeaderVideoSize();
		$(window).on('resize', pageHeaderVideoSize);

		if( isMobile ) {
			$('.page-header').find('.page-header-video').remove();
		}

		if( $('#ytplayer') ) {
			$('body').append('<script src="https://www.youtube.com/player_api">');
		}
	}

	/*-----------------------------------------------------------------------------------*/
	/*	Google Maps
	/*-----------------------------------------------------------------------------------*/

	/* Helper function to check if a number is a float */
	function isFloat(n){
	    return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0;
	}

	/* Check if a string is a coordinate */
	function checkCoordinates(str) {
		if( !str ) { return false; }

		str = str.split(',');
		var isCoordinate = true;

		if( str.length !== 2 || !isFloat(str[0].trim()) || !isFloat(str[1].trim()) ) {
			isCoordinate = false;
		}

		return isCoordinate;
	}

  	$('.map').each(function() {
	    /* Options */
	    var gmap = {
			zoom   : ($(this).attr('data-zoom')) ? parseInt($(this).attr('data-zoom')) : 15,
			address: $(this).attr('data-address'),
			markers: $(this).attr('data-markers'),
			icon   : $(this).attr('data-icon'),
			typeID : $(this).attr('data-type'),
			ID     : $(this).attr('id'),
			styles : JSON.parse($(this).attr('data-styles')),
	    };

	    var gmapScroll = ($(this).attr('data-scroll')) ? $(this).attr('data-scroll') : 'false';
	    var markersArray = [];
	    var bound = new google.maps.LatLngBounds();

	    if( gmapScroll == 'false' ) {
			gmap.draggable = false;
			gmap.scrollwheel = false;
	    }

	    /* Google Maps with markers */

	    if( gmap.markers ) {
	    	/* Get markers and their options */
			JSON.parse(gmap.markers).forEach(function(marker) {
				if( marker ) {
					if( checkCoordinates(marker.address) ) {
						marker.latLng = marker.address.split(',');
						delete marker.address;
					}

					if( marker.icon ) {
						marker.options = {'icon': marker.icon};
					} else {
						marker.options = {'icon': gmap.icon};
					}

					markersArray.push(marker);
				}
		    });

			$('#' + gmap.ID).gmap3({
				map: {
					options: {
						zoom       : gmap.zoom,
						draggable  : gmap.draggable,
						scrollwheel: gmap.scrollwheel,
						mapTypeId  : google.maps.MapTypeId[gmap.typeID],
						styles     : gmap.styles
					}
				},
		        marker: {
					values: markersArray,
					options: {
						draggable: false
					},
					callback: function(results) {
						var center = null;

						if( typeof results[0].position.lat !== 'function' ||
							typeof results[0].position.lng !== 'function' ) {
							return false;
						}

						results.forEach(function(m, i) {
							if( markersArray[i].center ) {
								center = new google.maps.LatLng(m.position.lat(), m.position.lng());
							} else {
								bound.extend(new google.maps.LatLng(m.position.lat(), m.position.lng()));
							}
						});

						if( !center ) {
							center = bound.getCenter();
						}

						$(this).gmap3('get').setCenter(center);
		        	},
					events: {
						click: function(marker, event, context) {
							if( !context.data ) { return false; }

							var map = $(this).gmap3('get'),
								infowindow = $(this).gmap3({
								get: { name:'infowindow' }
							});

							if (infowindow) {
								if( context.data ) {
									infowindow.open(map, marker);
									infowindow.setContent(decodeURIComponent(context.data));
								}
							} else {
								$(this).gmap3({
									infowindow: {
										anchor : marker,
										options: { content: decodeURIComponent(context.data) }
									}
								});
							}
						} /* click */
					} /* events */
				} /* marker */
		    }); /* gmap3 */
	    }

	    /* Google Maps Basic */

	    if( gmap.address ) {
			if( checkCoordinates(gmap.address) ) {
				$('#' + gmap.ID).gmap3({
					map: {
						options: {
							zoom       : gmap.zoom,
							draggable  : gmap.draggable,
							scrollwheel: gmap.scrollwheel,
							mapTypeId  : google.maps.MapTypeId[gmap.typeID],
							center     : gmap.address.split(','),
							styles     : gmap.styles
						}
					},
					marker: {
						latLng: gmap.address.split(','),
						options: {
							icon: gmap.icon
						}
					},
				});
			} else {
		        $('#' + gmap.ID).gmap3({
					map: {
						options: {
							zoom       : gmap.zoom,
							draggable  : gmap.draggable,
							scrollwheel: gmap.scrollwheel,
							mapTypeId  : google.maps.MapTypeId[gmap.typeID],
							styles     : gmap.styles
						},
					},
					getlatlng: {
						address:  gmap.address,
						callback: function(results) {
							if ( !results ) return;
							$(this).gmap3('get').setCenter(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
							$(this).gmap3({
								marker: {
									latLng:results[0].geometry.location,
									options: {
										icon: gmap.icon
									}
								}
							});
						}
					} /* getlatlng */
		        });
      		} /* else statement */
	    }
  	}); /* Each Map element */
});