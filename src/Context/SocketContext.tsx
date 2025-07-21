import SocketIoClient from 'socket.io-client';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { v4 as UUIDv4 } from 'uuid';

const ws_server = import.meta.env.VITE_WS_Server;
console.log(ws_server);
// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(ws_server);

interface Props {
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({children}) => {

    const navigate = useNavigate();

    const [user, setUser] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();

    const fetchParticpants = ({roomId, participants}: {roomId: string, participants: string[]}) => {
        console.log("Fetch Participants");
        console.log(roomId, participants);
    }

    const fetchUserFeed = async () => {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true});
        setStream(newStream);
    }

    useEffect(() => {

        const userId = UUIDv4();
        const newUser = new Peer(userId, {
            host: "localhost",
            port: 9000,
            path: "/myapp"
        });
        
        setUser(newUser);

        fetchUserFeed();

        const enterRoom = ({ roomId} : {roomId: string}) => {
            navigate(`/room/${roomId}`);
        }

        socket.on("room-created", enterRoom);

        socket.emit("get-user", fetchParticpants);
    }, []);

   

    return (
        <SocketContext.Provider  value={{ socket, user, stream }}>
            {children}
        </SocketContext.Provider>
    )
}

