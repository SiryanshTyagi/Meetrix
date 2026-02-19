import { useCallback, useRef, useState } from "react";

export const useMediaControls = ({ localVideoRef, localStreamRef, peersRef }) => {
  const screenStreamRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const replaceVideoTrackForAllPeers = useCallback(
    async (track) => {
      for (const peer of peersRef.current.values()) {
        const sender = peer
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender) {
          await sender.replaceTrack(track);
        }
      }
    },
    [peersRef],
  );

  const stopScreenShare = useCallback(async () => {
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
      screenStreamRef.current = null;
    }

    if (cameraTrack) {
      await replaceVideoTrackForAllPeers(cameraTrack);
    }

    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      localVideoRef.current.play().catch(() => {});
    }

    setIsScreenSharing(false);
  }, [localStreamRef, localVideoRef, replaceVideoTrackForAllPeers]);

  const startScreenShare = useCallback(async () => {
    if (!localStreamRef.current) return;

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];
      if (!screenTrack) {
        screenStream.getTracks().forEach((track) => track.stop());
        return;
      }

      await replaceVideoTrackForAllPeers(screenTrack);

      screenStreamRef.current = screenStream;
      setIsScreenSharing(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
        localVideoRef.current.play().catch(() => {});
      }

      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Screen share error:", err);
    }
  }, [localStreamRef, localVideoRef, replaceVideoTrackForAllPeers, stopScreenShare]);

  const toggleMute = useCallback(() => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  }, [localStreamRef]);

  const toggleCamera = useCallback(() => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setIsCameraOff(!videoTrack.enabled);
  }, [localStreamRef]);

  const cleanupMedia = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setIsScreenSharing(false);
  }, [localStreamRef, localVideoRef]);

  return {
    isMuted,
    isCameraOff,
    isScreenSharing,
    toggleMute,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
    cleanupMedia,
  };
};
