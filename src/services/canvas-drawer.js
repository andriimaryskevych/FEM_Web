import {
    WebGLRenderer,

    Scene,
    PerspectiveCamera,

    Points,
    Vector3,
    Triangle,
    Geometry,

    Color,
    PointsMaterial,
    MeshBasicMaterial,

    GridHelper,
    AxesHelper,

    Face3,
    Mesh,
    TrianglesDrawMode,
    TriangleFanDrawMode,
    TriangleStripDrawMode,
    DoubleSide,
    BufferAttribute,
    BufferGeometry,
    Line,
    VertexColors,
    LineBasicMaterial
 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const triangles = [
    [4, 12, 16, 0, 5, 8, 13, 1],
    [5, 13, 17, 1, 6, 9, 14, 2],
    [6, 14, 18, 2, 7, 10, 15, 3],
    [7, 15, 19, 3, 4, 11, 12, 0],
    [0, 11, 8, 3, 1, 10, 9, 2],
    [7, 19, 18, 4, 6, 16, 17, 5]
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

            for (let i = 0; i < startPoints['NT'].length; i++)
            {
                // This is one Finite Element
                let finiteElementVerticesNumbers = startPoints['NT'][i];

                triangles.forEach(site => {
                    let geometry = new BufferGeometry();
                    let positions = new Float32Array( 8 * 3 );

                    site.forEach((vertexNumber, index) => {
                        let point = startPoints['AKT'][finiteElementVerticesNumbers[vertexNumber]];

                        positions[index * 3] = point[0];
                        positions[index * 3 + 1] = point[1];
                        positions[index * 3 + 2] = point[2];
                    });

                    geometry.addAttribute( 'position', new BufferAttribute( positions, 3 ) );
                    let mesh = new Mesh( geometry, new MeshBasicMaterial( {
                        color: 'green'
                    } ) );
                    mesh.setDrawMode( TriangleStripDrawMode );

                    // scene.add(mesh);
                });
            }
        });

        // adding green points that represent result poistion
        let resultPoints;
        let result;

        socket.on('points.txt', (data) => {
            resultPoints = JSON.parse(data);

            for (let i = 0; i < resultPoints['NT'].length; i++)
            {
                // This is one Finite Element
                let finiteElementVerticesNumbers = resultPoints['NT'][i];

                triangles.forEach(site => {
                    let triangleGeometry = new BufferGeometry();
                    let lineGeometry = new BufferGeometry();

                    let positions = new Float32Array( 8 * 3 );

                    site.forEach((vertexNumber, index) => {
                        let point = resultPoints['AKT'][finiteElementVerticesNumbers[vertexNumber]];

                        positions[index * 3] = point[0];
                        positions[index * 3 + 1] = point[1];
                        positions[index * 3 + 2] = point[2];
                    });

                    triangleGeometry.addAttribute('position', new BufferAttribute(positions, 3));
                    let triangleMesh = new Mesh(triangleGeometry, new MeshBasicMaterial({ color: 'red' }));
                    triangleMesh.setDrawMode(TriangleStripDrawMode);
                    scene.add(triangleMesh);

                    lineGeometry.addAttribute('position', new BufferAttribute(positions, 3));
                    // lineGeometry.addAttribute( 'color', new BufferAttribute(colors, 3) );
                    let lineMaterial = new LineBasicMaterial({ vertexColors: VertexColors });
                    let lineMesh = new Line(lineGeometry, lineMaterial);
                    scene.add(lineMesh);

                });
            }
        });

        function loop() {

            renderer.render(scene, camera);
            requestAnimationFrame(loop);
        }

        loop();
    }
}

export default CanvasDrawer;