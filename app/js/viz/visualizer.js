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
				this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
				this.renderer.setSize(this.$node.width(), this.$node.height());
				this.node.appendChild(this.renderer.domElement);

				this.camera = new THREE.PerspectiveCamera(45, 9 / 16, 1, 10000);
				this.camera.position.x = 0;
				this.camera.position.y = 0,
				this.camera.position.z = 5000;
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
				directionalLight.position.set( 1, 1, 1 );
				this.scene.add( directionalLight );

				var ambientLight = new THREE.AmbientLight( 0x303030 );
				this.scene.add( ambientLight );

			// this.scene.add(this.cube);

				var perLine = 10;
				var cubeSize = this.$node.width() / perLine;
				var colors = [0xEEEEEE, 0x572A3C, 0x8C3542, 0xD14038, 0xA2EBD8]
				for (var i = 0; i < 100; i++) {
					var temp = new THREE.Mesh(
						new THREE.PlaneGeometry( cubeSize/1.41421356237, cubeSize/1.41421356237, 10, 10),
						new THREE.MeshLambertMaterial( {color: colors[Math.floor(Math.random()*5)] } )
						);
					temp.position.x = -this.$node.width()/2 + cubeSize/2 + (i % perLine) * cubeSize;
					temp.position.y = -this.$node.height()/2 + cubeSize/2 + (Math.floor(i/perLine)) * cubeSize;

					temp.rotation.y = Math.random() * Math.PI/12;
					// temp.rotation.z = Math.random() * Math.PI/12;

					var rotation = { 'panel': temp, theta: -Math.PI/12 };
					var target = { theta: Math.PI/12 };

					temp.tweenForward = 
						new TWEEN.Tween(rotation)
						.to(target, Math.random()*2000 + 1000)
						.delay(Math.random()*500)
						.easing(TWEEN.Easing.Elastic.InOut)
						.onUpdate(function() {
							this.panel.rotation.y = position.y
						});

					this.scene.add(temp);
					this.cubes.push({
						geometry: temp,
						// ySpeed: Math.random()*120 + 60,
						// zSpeed: Math.random()*120 + 60
					});

					temp.tweenForward.start();
				}
				window.debugCamera = this.camera;

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