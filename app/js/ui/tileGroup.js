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
			var _this = this;
			
			this.TILE_TEMPLATE = utils.tmpl(tileTemplate);

			this.defaultAttrs({
				individualTile: '.tile'
			});

			// Speed parameters
			// Bigger is slower. Smaller is faster.
            this.fastSpeed = 5000;
            this.slowSpeed = 80000;

			var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            this.currentTime = null;
            this.cycleLength = this.fastSpeed;

			// Create a set of arrangements to pick from.
			// layout.map maps the position in the final layout to article rank.
			var LAYOUTS = [
				{ sizes: [ '3x2', '2x2', '2x2', '2x1', '2x1', '2x1', '2x2', '1x1', '1x1', '1x1', '1x1', '2x2'],
					map: [11, 0, 4, 1, 2, 10, 5, 6, 8, 3, 7, 9]
				},
				{ sizes: [ '3x2', '2x2', '2x1', '2x1', '2x1', '2x1', '1x1', '1x1', '1x1', '1x1', '1x1', '2x2', '2x2'],
					map: [1, 0, 3, 5, 11, 12, 7, 4, 2, 6, 9, 8, 5, 10]
				},
				{ sizes: [ '3x2', '2x2', '2x2', '2x2', '2x1', '2x1', '2x1', '1x1', '1x1', '3x2'],
					map: [0, 1, 3, 4, 2, 9, 5, 6, 7, 8]
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
				  columnWidth: 240,
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
				
				// Begin animation
				requestAnimationFrame(this.animate.bind(this));
			}

			this.render = function(e, data) {
				this.$node.append(this.TILE_TEMPLATE(data.tile));
			}

			this.populateFeaturedTile = function(e, data) {
				var self = this;

				// Pulse animate tile
				$(data.el).addClass('transparent');

				setTimeout(function() {
					$(data.el).removeClass('transparent');
				}, 300);

				var requestedArticle = this.getArticle(data.el.dataset.id);

				// First screen
				if (e.clientX <= 1080) {
					$(this.$node.parent().parent().children().filter('.featuredTileContainer')[0]).find('.description h1')[0].innerHTML = requestedArticle.title;
					$(this.$node.parent().parent().children().filter('.featuredTileContainer')[0]).find('.description p')[0].innerHTML = requestedArticle.content;
					
					// Find media slider
					var slider = $(this.$node.parent().parent().children().filter('.featuredTileContainer')[0]).find('.media')[0];
					$(slider).html('');

					// Add media
					requestedArticle.media.forEach(function(imageSrc) {
						$(slider).append('<img class="slide" src="' + imageSrc + '">');
					});

					this.$node.addClass('featuredTileFocus');
					this.trigger($(this.$node.parent().parent().children().filter('.featuredTileContainer')[0]), 'showFeaturedTile');

					// Make description scrollable
					var scroll = new IScroll('#scroller1');
				
				// Second screen
				} else if (e.clientX <= 2160) {
					$(this.$node.parent().parent().children().filter('.featuredTileContainer')[1]).find('.description h1')[0].innerHTML = requestedArticle.title;
					$(this.$node.parent().parent().children().filter('.featuredTileContainer')[1]).find('.description p')[0].innerHTML = requestedArticle.content;
					
					// Find media slider
					var slider = $(this.$node.parent().parent().children().filter('.featuredTileContainer')[1]).find('.media')[0];
					$(slider).html('');

					// Add media
					requestedArticle.media.forEach(function(imageSrc) {
						$(slider).append('<img class="slide" src="' + imageSrc + '">');
					});

					this.$node.addClass('featuredTileFocus');
					this.trigger($(this.$node.parent().parent().children().filter('.featuredTileContainer')[1]), 'showFeaturedTile');

					// Make description scrollable
					var scroll = new IScroll('#scroller2');

				// Third screen
				} else {
					$(this.$node.parent().parent().children().filter('.featuredTileContainer')[2]).find('.description h1')[0].innerHTML = requestedArticle.title;
					$(this.$node.parent().parent().children().filter('.featuredTileContainer')[2]).find('.description p')[0].innerHTML = requestedArticle.content;
					
					// Find media slider
					var slider = $(this.$node.parent().parent().children().filter('.featuredTileContainer')[2]).find('.media')[0];
					$(slider).html('');

					// Add media
					requestedArticle.media.forEach(function(imageSrc) {
						$(slider).append('<img class="slide" src="' + imageSrc + '">');
					});

					this.$node.addClass('featuredTileFocus');
					this.trigger($(this.$node.parent().parent().children().filter('.featuredTileContainer')[2]), 'showFeaturedTile');

					// Make description scrollable
					var scroll = new IScroll('#scroller3');
				}
			}

			this.upvote = function(e, data) {
				var articleID = data.el.dataset.id;
				$.ajax({
				  url: "http://robowall.hcii.cs.cmu.edu/increment-popularity.php?id=" + articleID
				});
			}

			this.tileGroupFocus = function(e, data) {
				this.$node.removeClass('featuredTileFocus');
			}

			this.animate = function(time) {
				var self = this;
        		var width = 4320;
        		var offset = (time % self.cycleLength)/self.cycleLength * width;

				$(this.$node).children().each(function(i) {

					if (this.translated == undefined) this.translated = 0;

					// Animate top stream
					if ($(self.$node).hasClass('topStream')) {

						var left = Number($(this).css('left').replace('px',''));
						this.translated = (left + offset) % width - left - 800;
						$(this).css('-webkit-transform', 'translateX(' + this.translated + 'px)');

					// Animate bottom stream
					} else {

						var left = Number($(this).css('left').replace('px',''));
						this.translated = (width - offset + left) % width - left - 800;
						$(this).css('-webkit-transform', 'translateX(' + this.translated + 'px)');

					}
				});

				requestAnimationFrame(_this.animate.bind(this));
			}

			this.toggleStreamSpeed = function(e, data) {
				if (this.cycleLength == this.slowSpeed) {
					this.cycleLength = this.fastSpeed;
				} else {
					this.cycleLength = this.slowSpeed;
				}
			}

			this.buildOut = function(e, data) {
				// Build out transition
				this.$node.addClass('hidden');
			}

			this.buildIn = function(e, data) {
				// Build in transition
				setTimeout('$(".stream").removeClass("hidden"); ', 3000);
			}

			this.after('initialize', function() {
				var self = this;
				this.on('click', {'individualTile': this.populateFeaturedTile});
				this.on('click', {'individualTile': this.upvote});
				this.on('toggleStreamSpeed', this.toggleStreamSpeed);
				this.on('buildIn', this.buildIn);
				this.on('buildOut', this.buildOut);
				this.on('renderTiles', this.renderAll);
				this.on('hideFeaturedTile', this.tileGroupFocus);
				this.articles = [];
				this.layout = null;
			});
		}
	}
);