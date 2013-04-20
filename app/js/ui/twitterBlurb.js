"use strict";

define(
	[
		'flight/component'
	],
	function(defineComponent) {

		return defineComponent(twitterBlurb);

		function twitterBlurb() {
			this.after('initialize', function() {
				this.on('createdTile', function() {
					console.log("BARF");
				});
			});
		}
	}
);