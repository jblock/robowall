"use strict";

define(
	[
		'flight/component'
	],
	function(defineComponent) {

		return defineComponent(tileGroup);

		function tileGroup() {
			this.after('initialize', function() {
				console.log(this.$node);
				this.trigger('createdTile');
			});
		}
	}
);