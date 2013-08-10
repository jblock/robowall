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
			this.routineNames = [];
			this.currentRoutine = null;

			this.updateData = function(e, data) {
				var self = this;
				var firstLoad = false;

				if (self.routines.length == 0) {
					firstLoad = true;
				}

				// Reset routines
				self.routines = [];
				self.routineNames = [];

				var allArticles = _.sortBy(data.articles, "popularity").reverse();

				// Sort articles by routine
				data.routines.forEach(function(routine) {
					if (routine.name != "Uncategorized") {
						var routineArticles = _.filter(allArticles, function(article) { 
							return (_.contains(article.routines, routine.id) == true);
						});
						if (routineArticles.length >= 15) {
							self.routines.push(routineArticles);
						}
						self.routineNames.push(routine.name);
					}
				});

				if (firstLoad) {
					this.trigger(document, 'nextRoutine');
				}

				// Fetch data again in an hour
				setTimeout(function(){self.worker.postMessage("sync")}, 3600000);		
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
					// Change title
					$('#name').html(self.routineNames[self.currentRoutine]);

					var halfLength = Math.ceil(self.routines[self.currentRoutine].length / 2); 
					var leftSide = self.routines[self.currentRoutine].slice(0, halfLength);   
					var rightSide = self.routines[self.currentRoutine].slice(halfLength,self.routines[self.currentRoutine].length);

					self.trigger($('#screen .tileContainer .topStream'), 'renderTiles', { articles: leftSide });
					self.trigger($('#screen .tileContainer .botStream'), 'renderTiles', { articles: rightSide });
				}, 1000);

				// Trigger transition in
				this.trigger($('#screen .tileContainer .stream'), 'buildIn');

				// Swap routines in 5 minutes
				$('.featuredTileContainer').hide();
				setTimeout("$(document).trigger('nextRoutine')", 300000);
			}

			this.after('initialize', function() {
				var self = this;
				this.on(document, 'dataFetched', this.updateData);
				this.on(document, 'nextRoutine', this.nextRoutine);
				this.on(document, 'toggleSpeed', this.toggleSpeed);

				this.worker.addEventListener('message', function(event) {
					self.trigger(document, 'dataFetched', event.data);
				});

				// Fetch data
				self.worker.postMessage("sync");

				setupVision();

				// Setup featured article content sliders
				window.scroller1 = new FTScroller(document.getElementById('scroller1'), {
					scrollingX: false,
					bouncing: false
				});

				window.scroller2 = new FTScroller(document.getElementById('scroller2'), {
					scrollingX: false,
					bouncing: false
				});

				window.scroller3 = new FTScroller(document.getElementById('scroller3'), {
					scrollingX: false,
					bouncing: false
				});
			});

			this.worker = new Worker("/app/js/workers/sync.js");

		}

	}
);