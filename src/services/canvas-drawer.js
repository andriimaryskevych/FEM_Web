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
    Mesh
 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

            var starsMaterial = new PointsMaterial( { color: 'black', size: 2.0 } );
            var geometry = new Geometry();

            for (let i = 0; i < startPoints['NT'].length; i++)
            {
                let finiteElementVerticesNumbers = startPoints['NT'][i];

                for (let j = 0 ; j < finiteElementVerticesNumbers.length; j++) {
                    geometry.vertices.push(new Vector3(
                        startPoints['AKT'][finiteElementVerticesNumbers[j]][0],
                        startPoints['AKT'][finiteElementVerticesNumbers[j]][1],
                        startPoints['AKT'][finiteElementVerticesNumbers[j]][2])
                    );
                }
            }

            start = new Points( geometry, starsMaterial );

            scene.add(start);
        });

        // adding green points that represent result poistion
        let resultPoints;
        let result;

        socket.on('points.txt', (data) => {
            var starsMaterial = new PointsMaterial( { color: 'green', size: 3.0 } );
            var geometry = new Geometry();

            resultPoints = JSON.parse(data);

            for (let i = 0; i < resultPoints['NT'].length; i++)
            {
                let finiteElementVerticesNumbers = resultPoints['NT'][i];

                for (let j = 0 ; j < finiteElementVerticesNumbers.length; j++) {
                    geometry.vertices.push(new Vector3(
                        resultPoints['AKT'][finiteElementVerticesNumbers[j]][0],
                        resultPoints['AKT'][finiteElementVerticesNumbers[j]][1],
                        resultPoints['AKT'][finiteElementVerticesNumbers[j]][2])
                    );
                }
            }

            result = new Points( geometry, starsMaterial );

            scene.add(result);
        });

        var geom = new Geometry();

        geom.vertices.push(new Vector3(0, 0, 0));
        geom.vertices.push(new Vector3(30, 0, 0));
        geom.vertices.push(new Vector3(30, 30, 0));

        geom.faces.push(new Face3(0, 1, 2));

        var mesh = new Mesh(geom, new MeshBasicMaterial({color: 'gray'}));

        scene.add(mesh);

        function loop() {

            renderer.render(scene, camera);
            requestAnimationFrame(loop);
        }

        loop();
    }
}

export default CanvasDrawer;