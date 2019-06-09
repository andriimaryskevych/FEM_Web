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
    VertexColors,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/js/libs/dat.gui.min.js';
import Stats from 'three/examples/js/libs/stats.min.js';
import Lut from '../helpers/lut';

import SocketService from '../services/socket';
import Intersection from '../services/intersection';
import { observeStore } from '../helpers/redux-observer';
import {
    parts,
    trianlgesOnSquare,
    bigTrianlgesOnSquare,
    getID
} from '../helpers/fem';
import {
    MESH_CREATED,
    SOLVED,
} from '../helpers/state';

import {
    addPressure,
    hoverFE,
    changeState,
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
        this.camera.position.x = 300;
        this.camera.position.y = -300;
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

        this.lut = new Lut('rainbow');
        this.lut.setMin(0);
        this.lut.setMax(1);

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
            store.dispatch(changeState(MESH_CREATED));

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

                    bigTrianlgesOnSquare.forEach((triangle, triangleIndex) => {
                        triangle.forEach((vertex, vertexIndex) => {
                            const point = AKT[NTi[part[vertex]]];

                            positions[triangleIndex * 9 + vertexIndex * 3 + 0] = point[0];
                            positions[triangleIndex * 9 + vertexIndex * 3 + 1] = point[1];
                            positions[triangleIndex * 9 + vertexIndex * 3 + 2] = point[2];
                        });
                    });

                    let geometry = new BufferGeometry();
                    geometry.addAttribute('position', new BufferAttribute(positions, 3));
                    let mesh = new Mesh(geometry, new MeshBasicMaterial({
                        color: 'red',
                        side: DoubleSide
                    }));

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
            store.dispatch(changeState(SOLVED));

            let resultPoints = JSON.parse(data);

            let AKT = resultPoints['AKT'];
            let NT = resultPoints['NT'];
            let STRESS = resultPoints['STRESS'];

            this.lut.setMax(resultPoints['maxStress']);

            this.resultArea = new Group();
            this.resultNet = new Group();

            for (let i = 0; i < NT.length; i++)
            {
                let NTi = NT[i];

                parts.forEach(part => {
                    let positions = new Float32Array( 6 * 3 * 3 );
                    let colors = new Float32Array( 6 * 3 * 3 );

                    trianlgesOnSquare.forEach((triangle, triangleIndex) => {
                        triangle.forEach((vertex, vertexIndex) => {
                            const point = AKT[NTi[part[vertex]]];

                            positions[triangleIndex * 9 + vertexIndex * 3 + 0] = point[0];
                            positions[triangleIndex * 9 + vertexIndex * 3 + 1] = point[1];
                            positions[triangleIndex * 9 + vertexIndex * 3 + 2] = point[2];

                            const color = this.lut.getColor(STRESS[NTi[part[vertex]]]);

                            colors[triangleIndex * 9 + vertexIndex * 3 + 0] = color.r;
                            colors[triangleIndex * 9 + vertexIndex * 3 + 1] = color.g;
                            colors[triangleIndex * 9 + vertexIndex * 3 + 2] = color.b;
                        });
                    });

                    let geometry = new BufferGeometry();
                    geometry.addAttribute('position', new BufferAttribute(positions, 3));
                    geometry.addAttribute('color', new BufferAttribute(colors, 3));

                    let mesh = new Mesh(geometry, new MeshBasicMaterial({
                        vertexColors: VertexColors,
                        side: DoubleSide
                    }));

                    this.resultArea.add(mesh);

                    const material = new MeshBasicMaterial({
                        vertexColors: VertexColors,
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