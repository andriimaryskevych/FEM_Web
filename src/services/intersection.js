import { getNormalizedCoordinates } from '../helpers/coordinates';
import { getFirstIntersectedObjects } from '../helpers/raycaster';

export default class Intersection {
    constructor (canvas, camera, width, height) {
        this.canvas = canvas;
        this.camera = camera;
        this.width = width;
        this.height = height;
    }

    getIntersecion (event, objects) {
        const point = getNormalizedCoordinates(event, this.canvas, this.width, this.height);
        const intersected = getFirstIntersectedObjects(point, this.camera, objects);

        return intersected;
    }
}