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

				this.nextRoutine();
			}

			this.nextRoutine = function(e, data) {
				// Change this so it uses the currentRoutine, not the hardcoded routines
				// (Neither routine has enough sample data to fix this yet.)
				this.trigger($('#screen1 .tileContainer'), 'renderTiles', { articles: this.routines[0].slice(0,10) });
				this.trigger($('#screen2 .tileContainer'), 'renderTiles', { articles: this.routines[1].slice(0,10) });
				this.trigger($('#screen3 .tileContainer'), 'renderTiles', { articles: this.routines[0].slice(10,20) });
				
				if (this.currentRoutine < (this.routines.length-1)) {
					this.currentRoutine += 1;
				} else {
					this.currentRoutine = 0;
				}
			}

			this.after('initialize', function() {
				var self = this;
				this.on(document, 'dataFetched', this.updateData);

				this.worker.addEventListener('message', function(event) {
					self.trigger(document, 'dataFetched', event.data);
				});

				this.worker.postMessage("sync");
			});

			this.worker = new Worker("/app/js/workers/sync.js");

		}

	}
);