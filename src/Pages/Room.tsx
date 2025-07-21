import { useParams } from "react-router-dom";

const Room: React.FC = () => {

    const { id } = useParams();

    return (
        <div>
            Room is connected with id {id}
        </div>
    )
}

export default Room;