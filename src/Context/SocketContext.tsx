import SocketIoClient from 'socket.io-client';
import { createContext } from 'react';

const ws_server = import.meta.env.VITE_WS_Server;
console.log(ws_server);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(ws_server);

interface Props {
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({children}) => {
    return (
        <SocketContext.Provider  value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

