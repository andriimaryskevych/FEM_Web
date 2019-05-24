/**
 * This service exports the same socket connection for all its users
 * Implemented to avoid complexety of transfering large FEM data through redux stores
 * Not the best decision, but it allows to decouple react component from socket
 */

import openSocket from 'socket.io-client';

let socket;

const getConnection = () => {
    if (!socket) {
        socket = openSocket('http://localhost:4000');
    }

    return socket;
};

export default {
    getConnection
};