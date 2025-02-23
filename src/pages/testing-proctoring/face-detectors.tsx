import React, { useEffect, useRef, useState } from "react";
import {
  FaceDetector,
  FilesetResolver,
  Detection
} from "@mediapipe/tasks-vision";


const FaceDetectors: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [faceDetector, setFaceDetector] = useState<FaceDetector | null>(null);
  const [runningMode, setRunningMode] = useState<string>("IMAGE");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageSrcs, setImageSrcs] = useState<string[]>([]);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    const initializeFaceDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const detector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
          delegate: "GPU"
        },
        runningMode: "IMAGE"
      });
      setFaceDetector(detector);
    };
    initializeFaceDetector();
        const enableWebcam = async () => {
      if (!navigator.mediaDevices?.getUserMedia || !videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { frameRate: { max: 60 } } // Ensuring 1 FPS
      });
      videoRef.current.srcObject = stream;
    };

    enableWebcam();

    const captureFrame = () => {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setImgSrc(canvas.toDataURL("image/png"));
      setImageSrcs((prev) => [canvas.toDataURL("image/png"), ...prev]);
    };

    const intervalId = setInterval(captureFrame, 1000); // Capture at 1 FPS

    return () => clearInterval(intervalId);
  }, []);

  const handleImageClick = async (event: React.MouseEvent<HTMLImageElement>) => {
    if (!faceDetector) return;

    if (runningMode === "VIDEO") {
      setRunningMode("IMAGE");
      await faceDetector.setOptions({ runningMode: "IMAGE" });
    }

    const img = event.target as HTMLImageElement;
    const detections = faceDetector.detect(img).detections;
    console.log(detections);
    if (detections.length >1){
        console.log("More Than one face detected");
    } else if (detections.length === 1){
        console.log("Only one face detected");
    } else {
        console.log("No face detected");
    }
  };

  return (
    <div className="container">
      <h1>Face Detection</h1>
      <h1>Webcam Capture</h1>
      <video ref={videoRef} autoPlay playsInline className="webcam" />
      <img src={imgSrc ?? ''} onClick={handleImageClick} alt="Captured Frame" />
    </div>
    
  );
};




export default FaceDetectors;

