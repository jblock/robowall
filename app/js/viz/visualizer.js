'use strict';

define(
	[
		'flight/component',
		'THREE',
		'TWEEN',
		'../utils'
	], function(defineComponent, THREE, TWEEN, Utils) {
		return defineComponent(Visualizer);

		function Visualizer() {

			this.renderer;
			this.camera;
			this.scene;
			this.cube;

			this.renderModel;
			this.effectBloom;
			// this.effectCopy; // For Shaders

			this.composer;

			this.cubes = [];
			this.lights = {};

			this.state;

			this.particleRender = function(context) {
				context.beginPath();
				context.arc( 0, 0, 1, 0,  Math.PI * 2, true );
				context.fill();
			}

			this.init = function() {
				console.log("STARTING INIT");
				this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
				this.renderer.setSize(this.$node.width(), this.$node.height());
				this.node.appendChild(this.renderer.domElement);

				this.camera = new THREE.PerspectiveCamera(45, 9 / 16, 1, 10000);
				this.camera.position.x = 0;
				this.camera.position.y = 0,
				this.camera.position.z = 1000;
				this.camera.lookAt(new THREE.Vector3(0, 0, 0));

				this.scene = new THREE.Scene();

				// COLORS!!
				var colors = [0xEEEEEE, 0x572A3C, 0x8C3542, 0xD14038, 0xA2EBD8];
				
				var leftMid = new THREE.PointLight( colors[0], 3, 1000 );
				leftMid.position.set(-300, -700, 0);
				var rightMid = new THREE.PointLight( colors[1], 3, 1000 );
				rightMid.position.set(300, -700, 0);
				var bottomAmbient = new THREE.PointLight( colors[2], 3, 2000 );
				bottomAmbient.position.set(-400, 600, 5);

				window.bottomAmbient = bottomAmbient;
				window.leftMid = leftMid;
				window.rightMid = rightMid;

				this.scene.add(leftMid);
				this.scene.add(rightMid);
				this.scene.add(bottomAmbient);

				this.lights.bottomAmbient = bottomAmbient;
		
				var ambientLight = new THREE.AmbientLight( 0x444444 );
				this.scene.add( ambientLight );

				var numRows = 100; //100
				var numCols = 50; //60

				var cubeSize = 20/1.41421356237;
				for (var i = 0; i < numRows; i++) {
					for (var j = 0; j < numCols; j++) {
						var cube = {};
						var plane = new THREE.Mesh(
							new THREE.PlaneGeometry( cubeSize*.95, cubeSize*.95, 5, 5),
							new THREE.MeshPhongMaterial( {
								color: 0x555555, 
								ambient: 0x555555,
								specular: 0xffffff, 
								shininess: 10, 
								shading: THREE.SmoothShading
								} )
							);
						plane.position.x = -cubeSize*numCols/2 + cubeSize/2*0 + j * cubeSize;
						plane.position.y = -cubeSize*numRows/2 + cubeSize/2*0 + i * cubeSize;
						plane.rotation.x = i / numRows * -Math.PI/6;

						this.scene.add(plane);

						var bound = Math.PI/3;

						// plane.rotation.y = -bound;

						var start = { _ref: plane, theta: -bound };
						var startShift = { _ref: plane, z: 0 };
						var target = { backwardRef: plane, theta: bound };

						if (Math.random() > 0.823) {
							cube.forwardTween = 
								new TWEEN.Tween(start)
								.to({theta: bound}, Math.random()*4000+1000)
								.delay(Math.random()*4000)
								.easing(TWEEN.Easing.Exponential.Out)
								.onUpdate(function() {
									// console.log('forward');
									this._ref.rotation.y = this.theta;
								});
								// .start();

							cube.backwardTween = 
								new TWEEN.Tween(start)
								.to({theta: -bound}, Math.random()*4000+1000)
								// .delay(Math.random()*500)
								.easing(TWEEN.Easing.Exponential.Out)
								.onUpdate(function() {
									// console.log("back");
									this._ref.rotation.y = this.theta;
								});

							// var shiftTween = 
							// 	new TWEEN.Tween(startShift)
							// 	.to({z: Math.PI/4}, 2000)
							// 	.delay((Math.floor(i/perLine))*400)
							// 	.easing(TWEEN.Easing.Exponential.Out)
							// 	.onUpdate(function() {
							// 		this._ref.rotation.x = this.z;
							// 	})
							// 	.start();

							// var backShiftTween = 
							// 	new TWEEN.Tween(startShift)
							// 	.to({z: -Math.PI/4}, Math.random()*4000+100)
							// 	.easing(TWEEN.Easing.Exponential.Out)
							// 	.onUpdate(function() {
							// 		this._ref.rotation.x = this.z;
							// 	});

							cube.forwardTween.chain(cube.backwardTween);
							cube.backwardTween.chain(cube.forwardTween);
							// shiftTween.chain(backShiftTween);
							// backShiftTween.chain(shiftTween);
							// forwardTween.start();
						}

						cube.geometry = plane;
						this.cubes.push(cube);
					}
				}

				this.state = 0;
				console.log("FINISHED INIT");

			}

			this.startMotion = function() {
				for (var i = 0; i < this.cubes.length; i++) {
					if (this.cubes[i].forwardTween) {
						this.cubes[i].forwardTween.start();
					}
				}
			}

			this.disableMovingStuff = function() {
				this.state = 1;
			}

			this.enableMovingStuff = function() {
				this.state = 0;
			}

			this.loop = function() {
				var self = this;
				
				var render = function() {
					self.renderer.clear();
					self.renderer.render(self.scene, self.camera);
				}
				
				var animate = function(time) {
					requestAnimationFrame(animate, self.renderer.domElement);
					if (self.state !== 1) TWEEN.update();
					render();
				}
				
				animate(new Date().getTime());
			}

			this.after('initialize', function() {

				this.on('showFeaturedTile', this.disableMovingStuff);
				this.on('hideFeaturedTile', this.enableMovingStuff);

				this.init();
				console.log("THREE JS INITIALIZED");
				this.startMotion();
				this.loop();
				console.log("THREE JS ANIMATING");
			});
		}
	}
);