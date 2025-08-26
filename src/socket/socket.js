import io from 'socket.io-client';


// const socket = io.connect(`${process.env.REACT_APP_SOCKET_LIVE_URL}`, { transports: ['websocket'] });
// const socket = io.connect("https://two-way.sdcampus.com/mediasoup", {
//     transports: ["websocket"],
// });

// const socket = io.connect('http://localhost:3003/mediasoup', { transports: ['websocket'] });
const socket = io.connect('https://twoway-backend-prod.sdcampus.com/mediasoup', { transports: ['websocket'] });
// const socket = io.connect(process.env.REACT_APP_SOCKET_LIVE_URL, { transports: ['websocket'] });
export default socket;