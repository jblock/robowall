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
				var self = this;

				setTimeout(function() {
					self.$node.show();
					self.createSlider();
				}, 100);
			}

			this.hideTile = function(e, data) {
				var self = this;

				this.$node.addClass('fadeOut');
				$(this.$node.find('.featuredTile')[0]).addClass('fadeOutUpBig');

				setTimeout(function() {
					self.$node.hide();
					self.$node.removeClass('fadeOut');
					$(self.$node.find('.featuredTile')[0]).removeClass('fadeOutUpBig');
				}, 500);

				this.trigger(this.$node.siblings('.tileContainer')[0], 'hideFeaturedTile');
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
			});

		}

	}
);