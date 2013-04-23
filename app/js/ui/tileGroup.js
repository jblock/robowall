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
				// Create a default layout recipe
				var layouts = [{ '1x1': 4, '2x1': 1, '2x2': 1, '3x2': 1 },
							   { '1x1': 6, '2x1': 3, '2x2': 1, '3x2': 0 },
							   { '1x1': 4, '2x1': 2, '2x2': 2, '3x2': 0 }];
				var rand = Math.floor(Math.random()*3);

				this.$node.html('');
				// Todo: sort the articles by routine & popularity
				var preload =  new Image();
				data.articles.forEach(function(article) {
					// Cache image
					preload.src = article.media[0];
					if (layouts[rand]['3x2'] > 0) {
						article.size = '3x2';
						layouts[rand]['3x2'] --;
						this.render(e, {tile: article});
					} else if (layouts[rand]['2x2'] > 0) {
						article.size = '2x2';
						layouts[rand]['2x2'] --;
						this.render(e, {tile: article});
					} else if (layouts[rand]['2x1'] > 0) {
						article.size = '2x1';
						layouts[rand]['2x1'] --;
						this.render(e, {tile: article});
					} else if (layouts[rand]['1x1'] > 0) {
						article.size = '1x1';
						layouts[rand]['1x1'] --;
						this.render(e, {tile: article});
					}
				}, this);

				// Compute the optimal arrangement
				var container = document.querySelector('#tileContainer');
				var pckry = new Packery( container, {
				  // options
				  itemSelector: '.tile',
				  gutter: 20,
				  columnWidth: 245,
				  containerStyle: null
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