const THREE = require('three');
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls');

class CanvasDrawer {
    constructor(canvas, socket) {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        var scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(100, 100, 100);
        camera.lookAt( new THREE.Vector3( 50, 50, 50 ) );
        scene.add(camera);
        scene.add(new THREE.AmbientLight(0xf0f0f0));

        var light = new THREE.SpotLight(0xffffff, 1.5);
        light.position.set(0, 1500, 200);
        light.castShadow = true;
        light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 200, 2000));
        light.shadow.bias = -0.000222;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        scene.add(light);

        var planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
        planeGeometry.rotateX(-Math.PI / 2);

        var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });

        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = -200;
        plane.receiveShadow = true;
        scene.add(plane);

        var helper = new THREE.GridHelper(2000, 100);
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        scene.add(helper);

        var axes = new THREE.AxesHelper(1000);
        axes.position.set(0, 0, 0);
        scene.add(axes);

        let renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xffffff);

        let controls = new THREE.OrbitControls(camera, canvas);
        controls.addEventListener('change', render);
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

        function render() {
            renderer.render(scene, camera);
        }

        render();
    }
}

export default CanvasDrawer;