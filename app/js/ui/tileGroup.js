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

				// Run Packery
				var container = this.$node[0];
				var pckry = new Packery( container, {
				  // options
				  itemSelector: '.tile',
				  gutter: 30,
				  columnWidth: 235,
				  containerStyle: null
				});

				// Truncate overflowed titles
				var titles = $('.tile .title');
				_.each(titles, function(title) {
					var wrap = $(title).find('.wrap');
					var height = $(title).height();
					while (wrap.outerHeight() > height) {
					    wrap.text(function (index, text) {
					        return text.replace(/\W*\s(\S)*$/, '...');
					    });
					}
				});
			}

			this.render = function(e, data) {
				this.$node.append(this.TILE_TEMPLATE(data.tile));
			}

			this.populateFeaturedTile = function(e, data) {
				var self = this;

				// Pulse animate tile
				$(data.el).addClass('pulse');

				setTimeout(function() {
					$(data.el).removeClass('pulse');
				}, 1000);

				var requestedArticle = this.getArticle(data.el.dataset.id);
				$(this.$node.siblings('.featuredTileContainer')[0]).find('.description h1')[0].innerHTML = requestedArticle.title;
				$(this.$node.siblings('.featuredTileContainer')[0]).find('.description p')[0].innerHTML = requestedArticle.content;
				
				var slider = $(self.$node.siblings('.featuredTileContainer')[0]).find('.media')[0];
				$(slider).html('');

				requestedArticle.media.forEach(function(imageSrc) {
					$(slider).append('<img class="slide" src="' + imageSrc + '">');
				});

				this.trigger(this.$node.siblings('.featuredTileContainer')[0], 'showFeaturedTile');
			}

			this.upvote = function(e, data) {
				var articleID = data.el.dataset.id;
				$.ajax({
				  url: "http://robowall.hcii.cs.cmu.edu/increment-popularity.php?id=" + articleID
				});
			}

			this.buildOut = function(e, data) {
				this.$node.addClass('slowAnimation');
				this.$node.addClass('flyOut');
			}

			this.buildIn = function(e, data) {
				setTimeout('$(".tileContainer").removeClass("flyOut"); ', 1500);
				setTimeout('$(".tileContainer").removeClass("slowAnimation"); ', 2000);
			}

			this.after('initialize', function() {
				var self = this;
				this.on('click', {'individualTile': this.populateFeaturedTile});
				this.on('click', {'individualTile': this.upvote});
				this.on('buildIn', this.buildIn);
				this.on('buildOut', this.buildOut);
				this.on('renderTiles', this.renderAll);
				this.articles = [];
				this.layout = null;
			});
		}
	}
);