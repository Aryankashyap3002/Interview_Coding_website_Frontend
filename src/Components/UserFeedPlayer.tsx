import { useEffect, useRef } from "react";

interface UserFeedPlayerProps {
    stream: MediaStream;
}

const UserFeedPlayer: React.FC<UserFeedPlayerProps> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <video 
            ref={videoRef}
            style={{
                width: "300px",
                height: "200px"
            }}
            muted
            autoPlay
        />
    );
};

export default UserFeedPlayer;
