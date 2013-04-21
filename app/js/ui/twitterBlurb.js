"use strict";

define(
	[
		'flight/component'
	],
	function(defineComponent) {

		return defineComponent(twitterBlurb);

		function twitterBlurb() {
			this.peaches = function(e, data) {
				console.log(data);
				this.trigger(document, 'drawTestData', data);
			}

			this.after('initialize', function() {
				this.on(document, 'createdTile', this.peaches)
			});
		}
	}
);