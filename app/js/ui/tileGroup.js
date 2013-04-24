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

			this.articles = [];

			// Create a set of arrangements to pick from.
			// layout.map maps the position in the final layout to article rank.
			var LAYOUTS = [
				{ sizes: [ '3x2', '2x2', '2x1', '1x1', '1x1', '1x1', '1x1'],
					map: [6, 0, 1, 2, 3, 4, 5] },
				{ sizes: [ '3x2', '2x2', '2x2', '1x1', '1x1'],
					map: [0, 1, 2, 3, 4] },
				{ sizes: [ '2x2', '2x1', '2x1', '2x1', '2x1', '1x1', '1x1', '1x1', '1x1'],
					map: [1, 2, 3, 0, 6, 4, 5, 7, 8] },
				{ sizes: [ '3x2', '2x2', '2x1', '1x1', '1x1', '1x1', '1x1'],
					map: [0, 6, 1, 5, 3, 4, 2] },
				{ sizes: [ '3x2', '2x1', '2x1', '2x1', '2x1', '1x1', '1x1'],
					map: [2, 1, 3, 0, 4, 5, 6] 
				},
			];

			this.layout = null;

			this.getArticle = function(articleID) {
				var returnedArticle = {};
				this.articles.forEach(function(article) {
					if (article.id == parseInt(articleID)) {
						returnedArticle = article;
					}
				});
				return returnedArticle;
			}

			this.renderAll = function(e, data) {
				var _this = this;
				var tiles = [];

				// Choose layout
				this.layout = LAYOUTS[Math.floor(Math.random()*LAYOUTS.length)];

				// Sort articles by popularity in descending order
				this.articles = data.articles;
				var num_shown = this.layout.sizes.length;

				// Link articles to a size
				for(var i=0; i<num_shown; i++){
					var article = this.articles[i];
					article.size = this.layout.sizes[i];
					this.articles.push(article);
					tiles.push(null);
				}

				// Order the articles
				for(var i=0; i<num_shown; i++){
					tiles[i] = this.articles[this.layout.map[i]];
				}

				// Render every tile
				this.$node.html('');
				_.map(tiles, function(tile){ _this.render(e, {tile: tile}); });

				// Compute the optimal arrangement
				var container = this.$node[0];
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
				var self = this;
				var requestedArticle = this.getArticle(data.el.dataset.id);
				$(this.$node.siblings('.featuredTileContainer')[0]).find('.description h1')[0].innerHTML = requestedArticle.title;
				$(this.$node.siblings('.featuredTileContainer')[0]).find('.description p')[0].innerHTML = requestedArticle.content;
				$(this.$node.siblings('.featuredTileContainer')[0]).find('.media')[0].innerHTML = "";

				requestedArticle.media.forEach(function(imageSrc) {
					var img = $('<img>');
					img.attr('src', imageSrc);
					img.appendTo($(self.$node.siblings('.featuredTileContainer')[0]).find('.media')[0]);
				});

				this.$node.addClass('featuredTileFocus');
				this.trigger(this.$node.siblings('.featuredTileContainer')[0], 'showFeaturedTile');
			}

			this.tileGroupFocus = function(e, data) {
				this.$node.removeClass('featuredTileFocus');
			}

			this.after('initialize', function() {
				var self = this;
				this.on('click', {'individualTile': this.populateFeaturedTile});
				this.on('renderTiles', this.renderAll);
				this.on(document, 'hideFeaturedTile', this.tileGroupFocus);
			});
		}
	}
);