import {
    Vector2,
    Raycaster,
} from 'three';

const raycaster = new Raycaster();
const mouse = new Vector2();

export const getIntersectedObjects = (point, camera, objects) => {
    mouse.set(point.x, point.y);
    raycaster.setFromCamera(mouse, camera);

    return raycaster.intersectObjects(objects);
};

export const getFirstIntersectedObjects = (point, camera, objects) => {
    return getIntersectedObjects(point, camera, objects)[0];
};
