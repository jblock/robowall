'use strict';

define(
	[
		'./ui/tileGroup',
		'./ui/twitterBlurb',
		'./ui/featuredTile'
	],
	function(TileGroup, TwitterBlurb, FeaturedTile) {

		var initialize = function() {
			TwitterBlurb.attachTo(document);
			FeaturedTile.attachTo('#featuredTile');
			TileGroup.attachTo('#tileContainer');
		}

		return {
			initialize: initialize
		}
	}
);