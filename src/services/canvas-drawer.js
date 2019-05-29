import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    Vector3,
    Color,
    MeshBasicMaterial,
    GridHelper,
    AxesHelper,
    Mesh,
    DoubleSide,
    BufferAttribute,
    BufferGeometry,
    Group,
    Geometry,
    VertexColors,
    Face3
 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/js/libs/dat.gui.min.js';
import Stats from 'three/examples/js/libs/stats.min.js';

import SocketService from '../services/socket';
import Intersection from '../services/intersection';
import { observeStore } from '../helpers/redux-observer';
import { parts, trianlgesOnSquare, bigTrianlgesOnSquare, getID } from '../helpers/fem';

import {
    addPressure,
    hoverFE
} from '../actions';
import store from '../store';

class CanvasDrawer {
    constructor(canvas) {
        this.canvas = canvas;
        this.socket = SocketService.getConnection();

        this.setupCanvas()
            .setupScene()
            .setupCamera()
            .setupIntersection()
            .setupHelpers()
            .setupRenderer()
            .setupControls()
            .setupSocket()
            .setupGUIHelper();

        observeStore(
            store,
            state => state.mesh,
            newMesh => {
                console.log('New mesh creation request', newMesh);

                this.socket.emit('mesh', JSON.stringify(newMesh));
            },
            1
        );

        let hoverEffect;

        observeStore(
            store,
            state => state.hover,
            newMesh => {
                const meshID = this.femMeshMapper[newMesh];
                const hoveredMesh = this.startArea.getObjectById(meshID);

                // If previously some mesh was hovered
                if (hoverEffect) {
                    this.scene.remove(hoverEffect);
                    hoverEffect.geometry.dispose();
                    hoverEffect.material.dispose();
                    hoverEffect = undefined;
                }

                // If there is no hover mesh
                if (!hoveredMesh) {
                    return;
                }

                const clonedPositions = new Float32Array(hoveredMesh.geometry.attributes.position.array);
                const geometry = new BufferGeometry();
                geometry.addAttribute('position', new BufferAttribute(clonedPositions, 3));
                hoverEffect = new Mesh(geometry, new MeshBasicMaterial({ color: 'skyblue', side: DoubleSide }));

                this.scene.add(hoverEffect);
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

    setupIntersection () {
        this.Intersection = new Intersection(this.canvas, this.camera, this.width, this.height);

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

        this.stats = new Stats();
        this.stats.dom.classList.add('stats');
        this.stats.dom.removeAttribute('style');
        document.body.appendChild(this.stats.dom);

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
        this.meshFemMapper = {};
        this.femMeshMapper = {};

        this.socket.on('start.txt', (data) => {
            let startPoints = JSON.parse(data);

            let AKT = startPoints['AKT'];
            let NT = startPoints['NT'];

            this.startArea = new Group();
            this.startNet = new Group();

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
                    let mesh = new Mesh(geometry, new MeshBasicMaterial({ color: 'green', side: DoubleSide }));
                    this.startArea.add(mesh);

                    const material = new MeshBasicMaterial({ color: 'blue', wireframe: true });
                    const wireframe = new Mesh(geometry, material);
                    this.startNet.add(wireframe);

                    this.meshFemMapper[mesh.uuid] = {
                        fe: i,
                        part: partIndex
                    };

                    const id = getID(i, partIndex);
                    this.femMeshMapper[id] = mesh.id;

                    objects.push(mesh);
                });
            }

            this.scene.add(this.startArea);
            this.scene.add(this.startNet);
        });

        this.socket.on('points.txt', (data) => {
            let resultPoints = JSON.parse(data);

            let AKT = resultPoints['AKT'];
            let NT = resultPoints['NT'];

            this.resultArea = new Group();
            this.resultNet = new Group();

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
                    this.resultArea.add(mesh);

                    var material = new MeshBasicMaterial({
                        color: 0x000000,
                        wireframe: true
                    });

                    var wireframe = new Mesh(geometry, material);
                    this.resultNet.add(wireframe);
                });
            }

            this.scene.add(this.resultArea);
            this.scene.add(this.resultNet);
        });

        const onDocumentMouseMove = (event) => {
            event.preventDefault();

            let payload;
            const intersected = this.Intersection.getIntersecion(event, objects);

            if (intersected) {
                const { fe, part } = this.meshFemMapper[intersected.object.uuid];

                payload = getID(fe, part);
            } else {
                payload = null;
            }

            store.dispatch(hoverFE(payload));
        };

        const onDocumentMouseClick= (event) => {
            event.preventDefault();

            const intersected = this.Intersection.getIntersecion(event, objects);

            if (intersected) {
                const fem = this.meshFemMapper[intersected.object.uuid];

                store.dispatch(addPressure(fem))
            }
        };

        this.canvas.addEventListener('mousemove', onDocumentMouseMove, false);
        this.canvas.addEventListener('click', onDocumentMouseClick, false);

        // Make the simplest shape possible: a triangle.
        var positions = new Float32Array(3 * 3);
        positions[0] = -100;
        positions[1] =  100;
        positions[2] =  1;

        positions[3] =  100;
        positions[4] =  100;
        positions[5] =  1;

        positions[6] =  100;
        positions[7] = -100;
        positions[8] =  1;

        var colors = new Float32Array([
            0,  0,  0,
            0.5,  0.5,  0.5,
            1,  1,  1,
        ]);

        let geometry = new BufferGeometry();
        geometry.addAttribute('position', new BufferAttribute(positions, 3));
        geometry.addAttribute('color', new BufferAttribute(colors, 3));

        // Using this material is important.
        var material = new MeshBasicMaterial({
            vertexColors: VertexColors,
            side: DoubleSide
        });

        var mesh = new Mesh(geometry, material);

        this.scene.add(mesh);

        const loop = () => {
            this.renderer.render(this.scene, this.camera);
            this.stats.update();
            requestAnimationFrame(loop);
        }

        loop();

        return this;
    }

    setupGUIHelper () {
        const selectionHandler = (item) => {
            const mesh = this[item];

            if (!mesh) {
                return;
            }

            let isCurrentlyOnTheScene;

            try {
                isCurrentlyOnTheScene = mesh.parent;
            } catch {
                isCurrentlyOnTheScene = false;
            }

            if (isCurrentlyOnTheScene) {
                this.scene.remove(mesh);

                return false;
            }

            this.scene.add(mesh);
            return true;
        };

        const object = {
            _StartFigure: true,
            get StartFigure () {
                return this._StartFigure;
            },
            set StartFigure (value) {
                const newValue = selectionHandler('startArea');

                this._StartFigure = newValue;
            },

            _StartNet: true,
            get StartNet () {
                return this._StartNet;
            },
            set StartNet (value) {
                const newValue = selectionHandler('startNet');

                this._StartNet = newValue;
            },

            _ResultFigure: true,
            get ResultFigure () {
                return this._ResultFigure;
            },
            set ResultFigure (value) {
                const newValue = selectionHandler('resultArea');

                this._ResultFigure = newValue;
            },

            _ResultNet: true,
            get ResultNet () {
                return this._ResultNet;
            },
            set ResultNet (value) {
                const newValue = selectionHandler('resultNet');

                this._ResultNet = newValue;
            }
        };

        const gui = new GUI();
        gui.add(object, 'StartFigure');
        gui.add(object, 'StartNet');
        gui.add(object, 'ResultFigure');
        gui.add(object, 'ResultNet');
    }
}

export default CanvasDrawer;