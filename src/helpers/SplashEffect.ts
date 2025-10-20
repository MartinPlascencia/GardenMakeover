import { Group, Mesh, Clock, MeshLambertMaterial, PlaneGeometry, Vector3, Texture, DoubleSide } from 'three';

export default class SplashEffect {
    private group: Group;
    private particles: Mesh[] = [];
    private materials: MeshLambertMaterial[] = [];
    private velocities: Vector3[] = [];
    private clock: Clock;
    private duration: number;
    private elapsed: number;
    private active: boolean;
    private particlesSize: { minSize: number; maxSize: number };

    constructor(texture: Texture, particlesNumber: number, duration: number = 1.2, minSize: number = 0.5, maxSize: number = 0.3) {
        this.group = new Group();
        this.clock = new Clock();
        this.particlesSize = { minSize, maxSize };
        this.duration = duration;
        this.elapsed = 0;
        this.active = false;

        const geometry = new PlaneGeometry(0.6, 0.6);

        for (let i = 0; i < particlesNumber; i++) {
            const material = new MeshLambertMaterial({
                map: texture,
                transparent: true,
                opacity: 1,
                depthWrite: false,
                side: DoubleSide,
            });

            const mesh = new Mesh(geometry, material);
            mesh.rotation.x = -Math.PI / 2; // face upward
            this.group.add(mesh);

            // random initial offset and velocity
            const angle = (i / 3) * Math.PI * 2 + (Math.random() * 0.3 - 0.15);
            const speed = 2 + Math.random() * 0.5;
            this.velocities.push(new Vector3(Math.cos(angle) * speed, 2 + Math.random(), Math.sin(angle) * speed));

            this.materials.push(material);
            this.particles.push(mesh);
        }
    }

    public get object3D(): Group {
        return this.group;
    }

    public update(delta: number, cameraPosition: Vector3): boolean {
        if (!this.active) return false;

        this.elapsed += delta;
        const progress = this.elapsed / this.duration;

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            const material = this.materials[i];
            const velocity = this.velocities[i];

            // simple outward + upward movement
            particle.position.x += velocity.x * delta * 0.5;
            particle.position.y += velocity.y * delta * 0.5;
            particle.position.z += velocity.z * delta * 0.5;

            particle.lookAt(cameraPosition);

            // fade and scale
            material.opacity = 1 - progress;
            const scale = 1 + progress * 1.5;
            particle.scale.set(scale, scale, scale);
        }

        if (this.elapsed >= this.duration) {
            this.active = false;
            this.group.visible = false;
            return false;
        }

        return true;
    }

    public reset(position?: Vector3): void {
        this.elapsed = 0;
        this.active = true;
        this.group.visible = true;

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            const material = this.materials[i];

            material.opacity = 1;
            const size = this.particlesSize.minSize + Math.random() * (this.particlesSize.maxSize - this.particlesSize.minSize);
            particle.scale.set(size, size, size);
            particle.position.set(0, 0, 0);

            const angle = (i / 3) * Math.PI * 2 + (Math.random() * 0.3 - 0.15);
            const speed = 1 + Math.random() * 0.5;
            this.velocities[i].set(Math.cos(angle) * speed, 2 + Math.random(), Math.sin(angle) * speed);
        }

        if (position) this.group.position.copy(position);
        this.clock.start();
    }
}
