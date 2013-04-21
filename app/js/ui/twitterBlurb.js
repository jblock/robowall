"use strict";

define(
	[
		'flight/component'
	],
	function(defineComponent) {

		return defineComponent(twitterBlurb);

		var testData = {
			tiles: [
				{
					title: "boop"
				},
				{
					title: "boop"
				},
				{
					title: "boop"
				},
				{
					title: "boop"
				},
			]
		};

		function twitterBlurb() {
			this.after('initialize', function() {
				this.on(document, 'createdTile', function() {
					console.log("twitter");
				});
				this.trigger(document, 'raw', testData);
			});
		}
	}
);