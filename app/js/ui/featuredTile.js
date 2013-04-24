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
				this.$node.show();
			}

			this.hideTile = function(e, data) {
				this.$node.hide();
				this.trigger(document, 'hideFeaturedTile');
			}

			this.after('initialize', function() {
				this.on('showFeaturedTile', this.showTile);
				this.on('click', this.hideTile);
			});

		}

	}
);