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

			this.cubes = [];

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
				this.camera.position.z = 2000;
				this.camera.lookAt(new THREE.Vector3(0, 0, 0));

				this.scene = new THREE.Scene();

				// var particle, material;
				// for (var i = 0; i < 200; i++) {
				// 	material = new THREE.ParticleCanvasMaterial( {color: 0xffffff, program: this.particleRender} );
				// 	particle = new THREE.Particle(material);

				// 	particle.position.y = Math.random() * 1000 - 500;
				// 	particle.position.x = Math.random() * 1000 - 500;
				// 	particle.position.z = 0;

				// 	particle.scale.x = particle.scale.y = 10;

				// 	this.scene.add(particle);
				// 	this.particles.push(particle);
				// }

				// // this.scene.add(mesh);
				// console.log(this.scene);
				// this.cube = new THREE.Mesh(
    //     	new THREE.CubeGeometry( 50, 50, 50 ),
    //     	new THREE.MeshLambertMaterial( {color: 0xEEEEEE} )
    //     	);
				var directionalLight = new THREE.DirectionalLight( 0xE0E0E0 );
				directionalLight.position.set( 1, 1, 500 );
				this.scene.add( directionalLight );

				var ambientLight = new THREE.AmbientLight( 0x303030 );
				this.scene.add( ambientLight );

			// this.scene.add(this.cube);

				var numRows = 100;
				var numCols = 60;

				var cubeSize = 20;
				var colors = [0xEEEEEE, 0x572A3C, 0x8C3542, 0xD14038, 0xA2EBD8]
				for (var i = 0; i < numRows; i++) {
					for (var j = 0; j < numCols; j++) {
					var plane = new THREE.Mesh(
						new THREE.PlaneGeometry( cubeSize/1.41421356237, cubeSize/1.41421356237, 5, 5),
						new THREE.MeshLambertMaterial( {color: colors[Math.floor(Math.random()*5)] } )
						);
					plane.position.x = -cubeSize*numCols/2 + cubeSize/2 + j * cubeSize;
					plane.position.y = -cubeSize*numRows/2 + cubeSize/2 + i * cubeSize;

					// plane.rotation.z = Math.random() * Math.PI/12;

					this.scene.add(plane);

					var bound = Math.PI/4;

					plane.rotation.y = -bound;

					var start = { _ref: plane, theta: -bound };
					var startShift = { _ref: plane, z: 0 };
					var target = { backwardRef: plane, theta: bound };

					if (Math.random() > 0.823) {
					var forwardTween = 
						new TWEEN.Tween(start)
						.to({theta: bound}, Math.random()*4000+1000)
						.delay(Math.random()*4000)
						.easing(TWEEN.Easing.Exponential.Out)
						.onUpdate(function() {
							// console.log('forward');
							this._ref.rotation.y = this.theta;
						})
						.start();

					var backwardTween = 
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

					forwardTween.chain(backwardTween);
					backwardTween.chain(forwardTween);
					// shiftTween.chain(backShiftTween);
					// backShiftTween.chain(shiftTween);
					// forwardTween.start();
					}

					this.cubes.push({
						geometry: plane,
						// forwardTween: forwardTween,
						// backwardTween: backwardTween
						// ySpeed: Math.random()*120 + 60,
						// zSpeed: Math.random()*120 + 60
					});
				}
			}
				console.log("FINISHED INIT");

			}

			// var self = this;

			this.loop = function() {
				var self = this;
				var render = function() {
					self.renderer.clear();
					self.renderer.render(self.scene, self.camera);
				}
				var animate = function(t) {
					requestAnimationFrame(animate, self.renderer.domElement);
					TWEEN.update();
					var cube;
					for (var i = 0; i < self.cubes.length; i++) {
						cube = self.cubes[i];
						// if (Math.abs(cube.geometry.rotation.y) > Math.PI/12) { cube.ySpeed = -cube.ySpeed; }
						// if (Math.abs(cube.geometry.rotation.z) > Math.PI/12) { cube.zSpeed = -cube.zSpeed; }
						// cube.geometry.rotation.y = cube.geometry.rotation.y + (1/cube.ySpeed);
						// cube.geometry.rotation.z = cube.geometry.rotation.z + (1/cube.zSpeed);
					}
					// self.cube.rotation.y = (t/1000) * Math.PI/2;
					render();
				}
				animate(new Date().getTime());
			}

			this.after('initialize', function() {
				this.init();
				this.loop();
				console.log("THREE JS INITIALIZED");
			});
		}
	}
);