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
				this.createSlider();
			}

			this.hideTile = function(e, data) {
				if (e.srcElement.className != "slide") {
					this.$node.hide();
					this.trigger(this.$node.siblings('.tileContainer')[0], 'hideFeaturedTile');
				}
			}

			this.createSlider = function(e, data) {
				var self = this;
				this.$node.find('.mediaContainer').iosSlider('destroy');
				this.$node.find('.mediaContainer').iosSlider({
					desktopClickDrag: true,
					snapSlideCenter: true
				});
			}

			this.after('initialize', function() {
				this.on('showFeaturedTile', this.showTile);
				this.on('click', this.hideTile);
				//this.on('click', this.hideTile);
			});

		}

	}
);