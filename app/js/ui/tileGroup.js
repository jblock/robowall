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

			this.defaultAttrs({
				individualTile: '.tile'
			});

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

			this.populateFeaturedTile = function(e, data) {
				this.trigger(document, 'showFeaturedTile');
			}

			this.after('initialize', function() {
				this.on(document, 'drawTestData', this.renderAll);
				this.on('click', {'individualTile': this.populateFeaturedTile});
				var n = [];
				for (var i = 0; i < 15; i++) {
				var p = ""+Math.floor(Math.random()*5000);
				n.push({
						title: p
					});
				}
				this.trigger(document, 'createdTile', {tiles: n});
			});
		}
	}
);