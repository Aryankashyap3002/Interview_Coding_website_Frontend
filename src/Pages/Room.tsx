import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {

    const { id } = useParams();
    const { socket, user, stream }= useContext(SocketContext);

    const navigate = useNavigate();

    function handleCloseTab () {
        socket.emit("delete-user", {
           roomId: id, peerId: user._id 
        })
        navigate('/');
    }

    useEffect(() => {
        if(user) socket.emit("joined-room", {roomId: id, peerId: user._id});
        console.log(user)
    }, [id, user, socket]);

    return (
        <div>
            Room is connected with id {id} and  user Id is {user && user._id}
            <UserFeedPlayer stream={stream}/>
            <button 
                type="button" 
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={handleCloseTab}
            >
                Close tab
            </button>

        </div>
    )
}

export default Room;