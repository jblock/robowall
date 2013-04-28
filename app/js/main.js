"use strict";

require.config({
	baseUrl: './',
	paths: {
		jquery: 'components/jquery/jquery',
		es5shim: 'components/es5-shim/es5-shim',
		es5sham: 'components/es5-shim/es5-sham',
		text: 'components/text/text',
		sylvester: 'components/sylvester/sylvester',
		underscore: 'components/underscore/underscore',
		THREE: 'components/threejs/build/three',
		TWEEN: 'components/tweenjs/build/tween.min',
		'jquery-easing': 'components/iosslider/_lib/jquery.easing-1.3',
		'jquery-iosslider': 'components/iosslider/_src/jquery.iosslider.min'
	},
	map: {
		'*': {
			'flight/component': 'components/flight/lib/component',
		}
	},
	shim: {
		'components/flight/lib/index': {
			deps: ['jquery', 'jquery-iosslider', 'es5shim', 'es5sham', 'underscore']
		},
		'app/js/app': {
			deps: ['components/flight/lib/index']
		},
		THREE: {
			exports: 'THREE'
		},
		TWEEN: {
			exports: 'TWEEN'
		},
		'jquery-iosslider': {
			deps: ['jquery', 'jquery-easing']
		}
	}
});

require(
	[
		'app/js/app', 
		'components/flight/lib/compose',
  	'components/flight/lib/registry',
  	'components/flight/lib/advice',
  	'components/flight/lib/logger',
		'components/flight/tools/debug/debug'
	], function(App, compose, registry, advice, withLogging, debug) {
		debug.enable(true);
		compose.mixin(registry, [advice.withAdvice, withLogging]);
		DEBUG.events.logAll();
		$(document).ready(function() {
			App.initialize();
		});
	}
);