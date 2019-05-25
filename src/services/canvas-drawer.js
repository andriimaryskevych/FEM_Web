import SocketService from '../services/socket';

class CanvasDrawer {
    constructor (canvas) {
        this.socket = SocketService.getConnection();
        this.canvas = canvas;
    }
}

export default CanvasDrawer;