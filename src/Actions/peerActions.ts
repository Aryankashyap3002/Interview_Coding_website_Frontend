export const ADD_PEER = "ADD_PEER" as const;
export const REMOVE_PEER = "REMOVE_PEER" as const;

export const addPeerActions = (peerId: string, stream: MediaStream) => ({
    type: ADD_PEER,
    payload: {peerId, stream}
});

export const removePeerActions = (peerId: string, stream: MediaStream) => ({
    type: REMOVE_PEER,
    payload: {peerId, stream}
});