'use strict';

define(
	[
		'./ui/tileGroup',
		'./ui/twitterBlurb',
		'./ui/featuredTile',
		'./viz/visualizer'
	],
	function(TileGroup, TwitterBlurb, FeaturedTile, Visualizer) {

		var initialize = function() {
			TwitterBlurb.attachTo(document);
			FeaturedTile.attachTo('#featuredTileContainer');
			TileGroup.attachTo('#tileContainer');
			Visualizer.attachTo('#threeContainer');
		}

		return {
			initialize: initialize
		}
	}
);