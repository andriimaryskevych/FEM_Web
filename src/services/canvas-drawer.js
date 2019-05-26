import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    Vector3,
    Vector2,
    Color,
    MeshBasicMaterial,
    GridHelper,
    AxesHelper,
    Mesh,
    DoubleSide,
    BufferAttribute,
    BufferGeometry,
    Raycaster,
    Group
 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { observeStore } from '../helpers/redux-observer';
import { parts, trianlgesOnSquare, bigTrianlgesOnSquare} from '../helpers/fem';
import store from '../store';

class CanvasDrawer {
    constructor(canvas, socket) {
        this.canvas = canvas;
        this.socket = socket;

        this.setupCanvas()
            .setupScene()
            .setupCamera()
            .setupHelpers()
            .setupRenderer()
            .setupControls()
            .setupSocket();

        observeStore(
            store,
            state => state.mesh,
            newMesh => {
                console.log('Observed value', newMesh);

                this.socket.emit('start', 'd');
            }
        );
    }

    setupCanvas () {
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;

        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);

        return this;
    }

    setupScene () {
        this.scene = new Scene();
        this.scene.background = new Color(0xf0f0f0);

        return this;
    }

    setupCamera () {
        const VIEW_ANGLE = 45;
        const ASPECT = this.width / this.height;
        const NEAR = 0.1;
        const FAR = 10000;

        this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera.position.z = 300;
        this.camera.up = new Vector3( 0, 0, 1 );
        this.scene.add(this.camera);

        return this;
    }

    setupHelpers () {
        this.gridHelper = new GridHelper(2000, 100);
        this.gridHelper.geometry.rotateX( Math.PI / 2 );
        this.gridHelper.material.opacity = 0.25;
        this.gridHelper.material.transparent = true;
        this.scene.add(this.gridHelper);

        this.axesHelper = new AxesHelper(1000);
        this.axesHelper.position.set(0, 0, 0);
        this.scene.add(this.axesHelper);

        return this;
    }

    setupRenderer () {
        this.renderer = new WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0xffffff);

        return this;
    }

    setupControls () {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.target = new Vector3( 50, 50, 0);
        this.controls.update();

        return this;
    }

    setupSocket () {
        // Objects for raycasting
        let objects = [];
        let meshFemMapper = {};

        // adding red points that represent statr poistion
        let startPoints;
        let start;

        this.socket.on('start.txt', (data) => {
            startPoints = JSON.parse(data);

            let AKT = startPoints['AKT'];
            let NT = startPoints['NT'];

            start = new Group;

            for (let i = 0; i < NT.length; i++)
            {
                let NTi = NT[i];

                parts.forEach((part, partIndex) => {
                    let positions = new Float32Array( 2 * 3 * 3 );

                    bigTrianlgesOnSquare.forEach((triangle, index) => {
                        const point0 = AKT[NTi[part[triangle[0]]]];
                        const point1 = AKT[NTi[part[triangle[1]]]];
                        const point2 = AKT[NTi[part[triangle[2]]]];

                        positions[index * 9 + 0] = point0[0];
                        positions[index * 9 + 1] = point0[1];
                        positions[index * 9 + 2] = point0[2];

                        positions[index * 9 + 3] = point1[0];
                        positions[index * 9 + 4] = point1[1];
                        positions[index * 9 + 5] = point1[2];

                        positions[index * 9 + 6] = point2[0];
                        positions[index * 9 + 7] = point2[1];
                        positions[index * 9 + 8] = point2[2];
                    });

                    let geometry = new BufferGeometry();
                    geometry.addAttribute('position', new BufferAttribute(positions, 3));
                    let mesh = new Mesh(geometry, new MeshBasicMaterial({
                        color: 'green',
                        side: DoubleSide
                    }));
                    start.add(mesh);

                    meshFemMapper[mesh.uuid] = {
                        fem: i,
                        part: partIndex
                    };

                    objects.push(mesh);

                    var material = new MeshBasicMaterial({
                        color: 0xffffff,
                        wireframe: true
                    });

                    var wireframe = new Mesh(geometry, material);
                    this.scene.add(wireframe);
                });
            }

            this.scene.add(start);
        });

        // adding green points that represent result poistion
        let resultPoints;
        let result;

        this.socket.on('points.txt', (data) => {
            resultPoints = JSON.parse(data);

            let AKT = resultPoints['AKT'];
            let NT = resultPoints['NT'];

            for (let i = 0; i < NT.length; i++)
            {
                let NTi = NT[i];

                parts.forEach(part => {
                    let positions = new Float32Array( 6 * 3 * 3 );

                    trianlgesOnSquare.forEach((triangle, index) => {
                        const point0 = AKT[NTi[part[triangle[0]]]];
                        const point1 = AKT[NTi[part[triangle[1]]]];
                        const point2 = AKT[NTi[part[triangle[2]]]];

                        positions[index * 9 + 0] = point0[0];
                        positions[index * 9 + 1] = point0[1];
                        positions[index * 9 + 2] = point0[2];

                        positions[index * 9 + 3] = point1[0];
                        positions[index * 9 + 4] = point1[1];
                        positions[index * 9 + 5] = point1[2];

                        positions[index * 9 + 6] = point2[0];
                        positions[index * 9 + 7] = point2[1];
                        positions[index * 9 + 8] = point2[2];
                    });

                    let geometry = new BufferGeometry();
                    geometry.addAttribute('position', new BufferAttribute(positions, 3));
                    let mesh = new Mesh(geometry, new MeshBasicMaterial({
                        color: 'red',
                        side: DoubleSide
                    }));
                    this.scene.add(mesh);

                    var material = new MeshBasicMaterial({
                        color: 0x000000,
                        wireframe: true
                    });

                    var wireframe = new Mesh(geometry, material);
                    this.scene.add(wireframe);
                });
            }
        });

        let mouse = new Vector2();
        let raycaster = new Raycaster();

        const onDocumentMouseMove = (event) => {
            event.preventDefault();

            var rect = this.canvas.getBoundingClientRect();

            const a = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };

            mouse.set( a.x / this.width * 2 - 1, - ( a.y / this.height ) * 2 + 1 );

            raycaster.setFromCamera( mouse, this.camera );
            var intersects = raycaster.intersectObjects(objects);

            if ( intersects.length > 0 ) {
                var intersect = intersects[0];
                console.log(meshFemMapper[intersect.object.uuid]);
            }

        }

        this.canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );

        const loop = () => {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(loop);
        }

        loop();
    }
}

export default CanvasDrawer;