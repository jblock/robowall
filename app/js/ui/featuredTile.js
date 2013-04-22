"use strict";

define(
	[
		'flight/component',
		'../utils'
	],
	function(defineComponent, utils) {

		return defineComponent(featuredTile);

		function featuredTile() {

			this.defaultAttrs({
				tileContainer: '#featuredTileContainer',
				featuredTile: '.featuredTile'
			});

			this.showTile = function(e, data) {
				this.$node.toggle();
			}

			this.hideTile = function(e, data) {
				this.$node.toggle();
			}

			this.after('initialize', function() {
				this.on(document, 'showFeaturedTile', this.showTile);
				this.on('click', {'tileContainer': this.hideTile});
			});

		}

	}
);