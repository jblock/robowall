'use strict';

define(
	[
		'./ui/controller',
		'./ui/tileGroup',
		'./ui/twitterBlurb',
		'./ui/featuredTile'
	],
	function(Controller, TileGroup, TwitterBlurb, FeaturedTile) {

		var initialize = function() {
			Controller.attachTo(document);
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