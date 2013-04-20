'use strict';

define(
	[
		'./ui/tileGroup',
		'./ui/twitterBlurb'
	],
	function(TileGroup, TwitterBlurb) {

		var initialize = function() {
			console.log('init');
			TwitterBlurb.attachTo(document);
			TileGroup.attachTo(document);
		}

		return {
			initialize: initialize
		}
	}
);