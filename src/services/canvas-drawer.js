import SocketService from '../services/socket';
var THREE = require('three');
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls');

class CanvasDrawer {
    constructor (canvas) {
        const socket = SocketService.getConnection();

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        let renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.setClearColor(0xffffff);

        let scene = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
        camera.position.set(0, 0, 100);
        camera.lookAt( new THREE.Vector3( 50, 50, 50 ) );

        let light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        var loader = new THREE.FileLoader();

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

            var starsMaterial = new THREE.PointsMaterial( { color: 'black', size: 2.0 } );
            var geometry = new THREE.Geometry();

            for(var i = 0; i < startPoints.length; i++)
            {
                geometry.vertices.push(new THREE.Vector3( startPoints[i].x, startPoints[i].y, startPoints[i].z) );
            }

            start = new THREE.Points( geometry, starsMaterial );

            scene.add(start);
        });

        // adding green points that represent result poistion
        let resultPoints;
        let result;

        socket.on('points.txt', (data) => {
            resultPoints = JSON.parse(data);

            var starsMaterial = new THREE.PointsMaterial( { color: 'green', size: 3.0 } );
            var geometry = new THREE.Geometry();

            for(var i = 0; i < resultPoints.length; i++)
            {
                geometry.vertices.push(new THREE.Vector3( resultPoints[i].x, resultPoints[i].y, resultPoints[i].z ));
            }

            result = new THREE.Points( geometry, starsMaterial );

            scene.add(result);
        });

        var axisHelper = new THREE.AxisHelper( 500 );
        scene.add( axisHelper );

        let controls = new THREE.OrbitControls( camera, canvas );
        controls.target = new THREE.Vector3( 50, 50, 50);
        controls.maxAzimuthAngle = Infinity;

        function loop() {

            renderer.render(scene, camera);
            requestAnimationFrame(loop);
        }

        loop();
    }
}

export default CanvasDrawer;