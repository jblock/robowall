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
			FeaturedTile.attachTo('#screen1 .featuredTileContainer');
			TileGroup.attachTo('#screen1 .tileContainer');

			FeaturedTile.attachTo('#screen2 .featuredTileContainer');
			TileGroup.attachTo('#screen2 .tileContainer');

			FeaturedTile.attachTo('#screen3 .featuredTileContainer');
			TileGroup.attachTo('#screen3 .tileContainer');
		}

		return {
			initialize: initialize
		}
	}
);