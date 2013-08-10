'use strict';

define(
	[
		'./ui/controller',
		'./ui/tileGroup',
		'./ui/featuredTile',
		'./viz/visualizer'
	],
	function(Controller, TileGroup, FeaturedTile, Visualizer) {

		var initialize = function() {
			Controller.attachTo(document);
			//Visualizer.attachTo('#screen .threeContainer');
			FeaturedTile.attachTo('#screen .featuredTileContainer');
			TileGroup.attachTo('#screen .tileContainer .topStream');
			TileGroup.attachTo('#screen .tileContainer .botStream');
		}

		return {
			initialize: initialize
		}
	}
);