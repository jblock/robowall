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

			this.nextRoutine = function(e, data) {
				if (this.currentRoutine < (this.routines.length-1)) {
					this.currentRoutine += 1;
				} else {
					this.currentRoutine = 0;
				}

				this.trigger($('#screen1 .tileContainer'), 'renderTiles', { articles: this.routines[this.currentRoutine].slice(0,9) });
				this.trigger($('#screen2 .tileContainer'), 'renderTiles', { articles: this.routines[this.currentRoutine].slice(9,18) });
				this.trigger($('#screen3 .tileContainer'), 'renderTiles', { articles: this.routines[this.currentRoutine].slice(18,27) });
			
				// Swap routines in 3 minutes
				$('.featuredTileContainer').hide()
				setTimeout("$(document).trigger('nextRoutine')", 180000);
			}

			this.after('initialize', function() {
				var self = this;
				this.on(document, 'dataFetched', this.updateData);
				this.on(document, 'nextRoutine', this.nextRoutine);

				this.worker.addEventListener('message', function(event) {
					self.trigger(document, 'dataFetched', event.data);
				});

				this.worker.postMessage("sync");
			});

			this.worker = new Worker("/app/js/workers/sync.js");

		}

	}
);