import SocketIoClient from 'socket.io-client';
import { createContext, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { v4 as UUIDv4 } from 'uuid';
import { peerReducer } from '../Reducer/peerReducer';
import { addPeerActions } from '../Actions/peerActions';

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

    const [peers, dispatch] = useReducer(peerReducer, {})

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
            host: "16.171.0.79",
            port: 9000,
            path: "/myapp",
            secure: false
        });
        
        setUser(newUser);

        fetchUserFeed();

        const enterRoom = ({ roomId} : {roomId: string}) => {
            navigate(`/room/${roomId}`);
        }

        socket.on("room-created", enterRoom);

        socket.on("get-user", fetchParticpants);
    }, []);

   useEffect(() => {
        if(!user || !stream) return;
        socket.on("user-joined", ({peerId}) => {
            const call = user.call(peerId, stream);
            console.log("Calling the new peer ", peerId);
            call.on("stream", () => {
                dispatch(addPeerActions(peerId, stream));
            })
        });

        user.on("call", (call) => {
            console.log("receiving a call");
            call.answer(stream);
            call.on("stream", () => {
                dispatch(addPeerActions(call.peer, stream));
            })
        });

        socket.emit("ready");

   }, [user, stream])

    return (
        <SocketContext.Provider  value={{ socket, user, stream, peers }}>
            {children}
        </SocketContext.Provider>
    )
}

