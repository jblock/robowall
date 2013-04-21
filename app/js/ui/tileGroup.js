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

			this.TILE_TEMPLATE = utils.tmpl(tileTemplate);

			this.renderAll = function(e, data) {
				console.log('render all: ', data.tiles);
				this.$node.html('');
				data.tiles.forEach(function(data) {
					this.render(e, {tile: data});
				}, this);
			}

			this.render = function(e, data) {
				this.$node.append(this.TILE_TEMPLATE(data.tile));
			}

			this.after('initialize', function() {
				this.on(document, 'drawTestData', this.renderAll);
				var n = [];
				n.push({
						title: "sauce"
					});
				n.push({title: "oranges"});
				this.trigger(document, 'createdTile', {tiles: n});
			});
		}
	}
);