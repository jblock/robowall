"use strict";

define(
	[
		'flight/component',
		'text!/app/templates/tile.html',
		'../utils'
	],
	function(defineComponent, tileTemplate, utils) {

		return defineComponent(tileGroup);

		function tileGroup() {

			var TILE_TEMPLATE = utils.tmpl(tileTemplate);

			this.renderAll = function(e, data) {
				console.log('render all');
				this.$node.html('');
				data.tiles.forEach(function(curTile) {
					this.render(e, {tile: curTile});
				}, this);
			};

			this.render = function(e, data) {
				this.$node.append(TILE_TEMPLATE(data.tile));
			}

			this.after('initialize', function() {
				this.on(document, 'raw', this.renderAll);
				this.on(document, 'uiMoveMail', this.requestSelectorWidget);
				this.trigger(document, 'createdTile');
			});
		}
	}
);