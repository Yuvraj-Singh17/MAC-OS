import { useEffect, useRef } from "react";
import MacWindow from "./MacWindow";

const Camera = ({ windowName, setWindowsState }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log("Camera error:", err);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "photo.png";
    link.click();
  };

  return (
    <MacWindow windowName={windowName} setWindowsState={setWindowsState}>
      <style>{`
        .camera-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #1c1c1e;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .camera-video-area {
          position: relative;
          width: 100%;
          flex: 1;
          background: #000;
          overflow: hidden;
        }

        .camera-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* subtle vignette overlay */
        .camera-video-area::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%);
          pointer-events: none;
        }

        .camera-toolbar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 0 16px;
          background: #1c1c1e;
          gap: 20px;
        }

        /* shutter button */
        .shutter-btn {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.25);
          transition: transform 0.1s ease, box-shadow 0.15s ease;
          outline: none;
        }

        .shutter-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 0 0 4px rgba(255,255,255,0.35);
        }

        .shutter-btn:active {
          transform: scale(0.93);
          box-shadow: 0 0 0 2px rgba(255,255,255,0.2);
        }

        /* outer ring */
        .shutter-btn::before {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2.5px solid rgba(255,255,255,0.55);
        }

        /* inner circle */
        .shutter-inner {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #d0d0d0;
        }

        .shutter-btn:active .shutter-inner {
          background: #e0e0e0;
        }

        /* pulse animation on hover */
        @keyframes shutterPulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.45); }
          70%  { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }

        .shutter-btn:hover {
          animation: shutterPulse 1s ease infinite;
        }
      `}</style>

      <div className="camera-wrapper">
        {/* video feed */}
        <div className="camera-video-area">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
          />
        </div>

        {/* bottom toolbar with shutter */}
        <div className="camera-toolbar">
          <button
            className="shutter-btn"
            onClick={capturePhoto}
            title="Take Photo"
            aria-label="Take Photo"
          >
            <div className="shutter-inner" />
          </button>
        </div>

        {/* hidden canvas for capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </MacWindow>
  );
};

export default Camera;