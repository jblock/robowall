"use strict";

define(
	[
		'flight/component',
		'../utils'
	],
	function(defineComponent, utils) {

		return defineComponent(controller);

		function controller() {

			this.routines = [];
			this.currentRoutine = null;

			this.updateData = function(e, data) {
				var self = this;
				var allArticles = _.sortBy(data.articles, "popularity").reverse();

				// Sort articles by routine
				data.routines.forEach(function(routine) {
					if (routine.name != "Uncategorized") {
						var routineArticles = _.filter(allArticles, function(article) { 
							return (_.contains(article.routines, routine.id) == true);
						});
						self.routines.push(routineArticles);
					}
				});

				this.trigger(document, 'nextRoutine');
			}

			this.toggleSpeed = function(e, data) {
				this.trigger($('#screen .tileContainer .stream'), 'toggleStreamSpeed');
			}

			this.nextRoutine = function(e, data) {
				var self = this;
				if (this.currentRoutine < (this.routines.length-1)) {
					this.currentRoutine += 1;
				} else {
					this.currentRoutine = 0;
				}

				// Trigger transition out
				this.trigger($('#screen .tileContainer .stream'), 'buildOut');

				// Draw tiles
				setTimeout(function() {
					self.trigger($('#screen .tileContainer .topStream'), 'renderTiles', { articles: self.routines[self.currentRoutine].slice(0,13) });
					self.trigger($('#screen .tileContainer .botStream'), 'renderTiles', { articles: self.routines[self.currentRoutine].slice(13,27) });
				}, 1000);

				// Trigger transition in
				this.trigger($('#screen .tileContainer .stream'), 'buildIn');

				// Swap routines in 3 minutes
				$('.featuredTileContainer').hide();
				$('.tileContainer').removeClass('featuredTileFocus');
				setTimeout("$(document).trigger('nextRoutine')", 180000);
			}

			this.after('initialize', function() {
				var self = this;
				this.on(document, 'dataFetched', this.updateData);
				this.on(document, 'nextRoutine', this.nextRoutine);
				this.on(document, 'toggleSpeed', this.toggleSpeed);

				this.worker.addEventListener('message', function(event) {
					self.trigger(document, 'dataFetched', event.data);
				});

				this.worker.postMessage("sync");

				/* Comment me out for debugging */
				setupVision();
			});

			this.worker = new Worker("/app/js/workers/sync.js");

		}

	}
);