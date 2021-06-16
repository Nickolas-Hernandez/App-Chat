import React from 'react';
// import { io } from 'socket.io-client';

const SocketContext = React.createContext();

export default SocketContext;

// export function SocketProvider({ children }) {
//   const socket = io();

//   return (
//     <SocketContext.Provider value={socket}>
//       { children }
//     </SocketContext.Provider >
//   );
// }
