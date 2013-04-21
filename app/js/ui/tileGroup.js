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
				console.log(data);
				this.$node.html('');
				data.articles.forEach(function(article) {
					this.render(e, {tile: article});
				}, this);
				var container = document.querySelector('#tileContainer');
				var pckry = new Packery( container, {
				  // options
				  itemSelector: '.tile',
				  gutter: 10,
				  columnWidth: 245
				});
			}

			this.render = function(e, data) {
				this.$node.append(this.TILE_TEMPLATE(data.tile));
			}

			this.populateFeaturedTile = function(e, data) {
				this.trigger(document, 'showFeaturedTile');
			}

			this.after('initialize', function() {
				var self = this;
				this.on('click', {'individualTile': this.populateFeaturedTile});
				this.on(document, 'dataFetched', this.renderAll);

				this.worker.addEventListener('message', function(event) {
					self.trigger(document, 'dataFetched', event.data);
				});

				this.worker.postMessage("sync");
			});

			this.worker = new Worker("/app/js/workers/sync.js");
		}
	}
);