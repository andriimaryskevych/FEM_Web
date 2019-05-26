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
    Raycaster
 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Adapts each part to standart square to vertexes of standart cube:
 *
 * 3----6----2
 * |         |
 * |         |
 * 7         5
 * |         |
 * |         |
 * 0----4----1
 */
const parts = [
    [0, 1, 5, 4, 8, 13, 16, 12],
    [1, 2, 6, 5, 9, 14, 17, 13],
    [2, 3, 7, 6, 10, 15, 18, 14],
    [3, 0, 4, 7, 11, 12, 19, 15],
    [0, 1, 2, 3, 8, 9, 10, 11],
    [4, 5, 6, 7, 16, 17, 18, 19]
];

// Defines collection of triangles on each square
const trianlgesOnSquare = [
    [7, 6, 3],
    [7, 0 ,4],
    [4, 1, 5],
    [5, 2, 6],
    [7, 4, 6],
    [4, 5, 6]
];

const bigTrianlgesOnSquare = [
    [0, 3, 2],
    [0, 2, 1]
];

class CanvasDrawer {
    constructor(canvas, socket) {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        var scene = new Scene();
        scene.background = new Color(0xf0f0f0);

        var VIEW_ANGLE = 45;
        var ASPECT = width / height;
        var NEAR = 0.1;
        var FAR = 10000;
        let camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.z = 300;
        camera.up = new Vector3( 0, 0, 1 );
        scene.add(camera);

        var helper = new GridHelper(2000, 100);
        helper.geometry.rotateX( Math.PI / 2 );
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        scene.add(helper);

        var axes = new AxesHelper(1000);
        axes.position.set(0, 0, 0);
        scene.add(axes);

        let renderer = new WebGLRenderer({ canvas });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xffffff);

        let controls = new OrbitControls(camera, canvas);
        controls.target = new Vector3( 50, 50, 0);
        controls.update();

        // Objects for raycasting
        let objects = [];
        let meshFemMapper = {};

        // adding red points that represent statr poistion
        let startPoints;
        let start;

        socket.on('start.txt', (data) => {
            if (start) {
                scene.remove(start);
                start.geometry.dispose();
                start.material.dispose();
                start = undefined;

                scene.remove(result);
                result.geometry.dispose();
                result.material.dispose();
                result = undefined;
            }

            startPoints = JSON.parse(data);

            let AKT = startPoints['AKT'];
            let NT = startPoints['NT'];

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
                    scene.add(mesh);

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
                    scene.add(wireframe);
                });
            }
        });

        // adding green points that represent result poistion
        let resultPoints;
        let result;

        socket.on('points.txt', (data) => {
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
                    scene.add(mesh);

                    var material = new MeshBasicMaterial({
                        color: 0x000000,
                        wireframe: true
                    });

                    var wireframe = new Mesh(geometry, material);
                    scene.add(wireframe);
                });
            }
        });

        canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );

        let mouse = new Vector2();
        let raycaster = new Raycaster();

        function onDocumentMouseMove (event) {
            event.preventDefault();

            var rect = canvas.getBoundingClientRect();

            const a = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };

            mouse.set( a.x / width * 2 - 1, - ( a.y / height ) * 2 + 1 );

            raycaster.setFromCamera( mouse, camera );
            var intersects = raycaster.intersectObjects(objects);

            if ( intersects.length > 0 ) {
                var intersect = intersects[0];
                console.log(meshFemMapper[intersect.object.uuid]);
            }

        }

        function loop() {

            renderer.render(scene, camera);
            requestAnimationFrame(loop);
        }

        loop();
    }
}

export default CanvasDrawer;