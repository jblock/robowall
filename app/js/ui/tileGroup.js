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

			// Create a set of arrangements to pick from.
			var LAYOUTS = [
					{ '1x1': 4, '2x1': 1, '2x2': 1, '3x2': 1 },
					{ '1x1': 6, '2x1': 3, '2x2': 1, '3x2': 0 },
					{ '1x1': 4, '2x1': 3, '2x2': 0, '3x2': 1 },
					{ '1x1': 4, '2x1': 0, '2x2': 0, '3x2': 2 },
					{ '1x1': 2, '2x1': 2, '2x2': 1, '3x2': 1 }
				];

			this.layout = LAYOUTS[Math.floor(Math.random()*LAYOUTS.length)];

			this.renderAll = function(e, data) {
				var _this = this;

				// Sort articles by popularity in descending order.
				this.articles = _.sortBy(data.articles, "popularity").reverse();
				
				// Pair the most popular articles with the largest block sizes
				var pairs = _.zip(this.articles, this._blockSizes().reverse());
				var tiles = _.compact(_.map(pairs, function(pair){
					var article = pair[0], size = pair[1];
					article.size = size;
					if (article.size != undefined) return article;
				}));
			
			 	// tiles = _.shuffle(tiles);

				_.map(tiles, function(tile){ 
					_this.render(e, {tile: tile}); 
				});

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

			// Turns layout{keyA: 2, keyB: 3} -> [keyA, keyA, keyB, keyB, keyB]
			this._blockSizes = function(){
				var expanded =  _.map(this.layout, function(count, size){
					var blocks_my_size = [ ]
					while (count > 0){ 
						blocks_my_size.push(size); 
						count--;
					}
					return blocks_my_size;
				});
				return _.compact(_.flatten(expanded));
			}
		}
	}
);