"use strict";

define(
	[
		'flight/component'
	],
	function(defineComponent) {

		return defineComponent(tileGroup);

		function tileGroup() {
			this.after('initialize', function() {
				this.trigger('createdTile');
			});
		}
	}
);