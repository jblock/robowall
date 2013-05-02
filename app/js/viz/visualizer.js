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

			this.particles = [];

			this.particleRender = function(context) {
				context.beginPath();
				context.arc( 0, 0, 1, 0,  Math.PI * 2, true );
				context.fill();
			}

			this.init = function() {
				this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
				this.renderer.setSize(this.$node.width(), this.$node.height());
				this.node.appendChild(this.renderer.domElement);

				this.camera = new THREE.PerspectiveCamera(40, 9 / 16, 1, 1000);
				this.camera.position.x = 0;
				this.camera.position.y = 0,
				this.camera.position.z = 1000;
				this.camera.lookAt(new THREE.Vector3(0, 0, 0));

				this.scene = new THREE.Scene();

				var particle, material;
				for (var i = 0; i < 200; i++) {
					material = new THREE.ParticleCanvasMaterial( {color: 0xFFFFFF, program: this.particleRender} );
					particle = new THREE.Particle(material);

					particle.position.y = Math.random() * 1000 - 500;
					particle.position.x = Math.random() * 1000 - 500;
					particle.position.z = 0;

					particle.scale.x = particle.scale.y = 10;

					this.scene.add(particle);
					this.particles.push(particle);
				}

				// this.scene.add(mesh);
				console.log(this.renderer);
			}

			var self = this;

			this.loop = function() {
				var self = this;
				var render = function() {
					self.renderer.render(self.scene, self.camera);
				}
				var animate = function() {
					requestAnimationFrame(animate);
					render();
				}
				animate();
			}

			this.after('initialize', function() {
				this.init();
				this.loop();
				console.log("THREE JS INITIALIZED");
			});
		}
	}
);