"use strict";

define(
	[
		'flight/component',
		'../utils'
	],
	function(defineComponent, utils) {

		return defineComponent(featuredTile);

		function featuredTile() {

			this.showTile = function(e, data) {
				console.log('showFeaturedTile');
			}

			this.hideTile = function(e, data) {
				console.log('hideFeaturedTile');
			}

			this.after('initialize', function() {
				console.log("featured tile created");

				this.on(document, 'showFeaturedTile', this.showTile);
				this.on(document, 'hideFeaturedTile', this.hideTile);
			});

		}

	}
);