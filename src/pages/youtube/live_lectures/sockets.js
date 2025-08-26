import io from 'socket.io-client';
// const sockets = io('http://localhost:3001', { autoConnect: true, forceNew: true });
// const sockets = io.connect('http://localhost:3005', { transports: ['websocket'] });
// const sockets = io.connect('https://stage-backend.sdcampus.com', { transports: ['websocket'] });
const sockets = io.connect('https://backend-prod.sdcampus.com', { transports: ['websocket'] });
// let sockets = io.connect('http://localhost:3001', { autoConnect: true, forceNew: true })
export default sockets;