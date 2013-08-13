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
				}, 100);
			}

			this.hideTile = function(e, data) {
				var self = this;

				if ((e.target.className != "closeBtn") && (!e.isTrigger)) {
					return;
				}

				this.$node.addClass('fadeOut');
				$(this.$node.find('.featuredTile')[0]).addClass('bounceOut');

				setTimeout(function() {
					self.$node.hide();
					self.$node.removeClass('fadeOut');
					$(self.$node.find('.featuredTile')[0]).removeClass('bounceOut');
				}, 500);

				this.trigger(this.$node.siblings('.tileContainer')[0], 'hideFeaturedTile');
			}

			this.after('initialize', function() {
				this.on('showFeaturedTile', this.showTile);
				this.on('click', this.hideTile);
				this.on('hideFeaturedTile', this.hideTile);
			});

		}

	}
);