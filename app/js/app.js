'use strict';

define(
	[
		'./ui/controller',
		'./ui/tileGroup',
		'./ui/twitterBlurb',
		'./ui/featuredTile',
		'./viz/visualizer'
	],
	function(Controller, TileGroup, TwitterBlurb, FeaturedTile, Visualizer) {

		var initialize = function() {
			Controller.attachTo(document);
			TwitterBlurb.attachTo(document);
			Visualizer.attachTo('#screen1 .threeContainer');
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