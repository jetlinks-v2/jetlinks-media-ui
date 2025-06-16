import mediaApi from "../../../../api/channel";

let pc: RTCPeerConnection | null = null;
let _tracks: MediaStreamTrack[] = [];

export const creatRTCUrl = (
  deviceId: string,
  channelId: string,
): Promise<MediaStream> => {
    return new Promise((resolve) => {

        if (pc) {
            closeVideo()
        }

        pc = new RTCPeerConnection();

        const transceiverOptions: RTCRtpTransceiverInit = {
            direction: "recvonly",
            sendEncodings: []
        };

        pc.addTransceiver("video", transceiverOptions);
        pc.addTransceiver("audio", transceiverOptions);

        pc.createOffer()
          .then(offer => {
              return pc!.setLocalDescription(offer).then(() => offer);
          })
          .then(offer => {
              return mediaApi.ptzStartPlay(deviceId, channelId, "rtc", offer.sdp);
          })
          .then(response => {
              return pc!.setRemoteDescription({
                  type: "answer",
                  sdp: response.sdp
              });
          })
          .catch(error => {
              console.error("Error setting up RTC connection:", error);
          });

        pc.ontrack = (event: RTCTrackEvent) => {
            _tracks.push(event.track);

            if (event.streams && event.streams.length > 0) {
                resolve(event.streams[0])
            } else if (pc!.getReceivers().length === _tracks.length) {
                const stream = new MediaStream(_tracks);
                resolve(stream)
            }
        };
    })
};

export const closeVideo = () => {
    if (pc) {
        pc.close();
        pc = null;
    }

    _tracks.forEach(track => track.stop());
    _tracks = [];
};
