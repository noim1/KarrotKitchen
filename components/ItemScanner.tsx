"use client";

import { useRef, useState } from "react";

export default function ItemScanner() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const uploadRef = useRef<HTMLInputElement | null>(null);

  async function startCamera() {
    try {
      setCameraError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch (error) {
      console.error(error);
      setCameraError(
        "Camera could not open. Check that camera permission is allowed."
      );
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const photo = canvas.toDataURL("image/jpeg");

    setImageUrl(photo);
    stopCamera();
  }

  function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }

  function clearPhoto() {
    setImageUrl(null);
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "40px auto",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "16px",
        backgroundColor: "white",
      }}
    >
      <h2>Scan Grocery Items</h2>

      <p>
        Take a photo of your groceries or upload an existing
        photo.
      </p>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{ display: "none" }}
      />

      {!cameraActive && !imageUrl && (
        <>
          <button
            type="button"
            onClick={startCamera}
            style={{
              width: "100%",
              padding: "18px",
              marginBottom: "12px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            📷 Open Camera
          </button>

          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            style={{
              width: "100%",
              padding: "18px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            🖼️ Upload Photo
          </button>
        </>
      )}

      {cameraActive && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              borderRadius: "12px",
              backgroundColor: "black",
              marginBottom: "12px",
            }}
          />

          <button
            type="button"
            onClick={capturePhoto}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            📸 Capture Photo
          </button>

          <button
            type="button"
            onClick={stopCamera}
            style={{
              width: "100%",
              padding: "12px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      {cameraError && (
        <p style={{ color: "red" }}>
          {cameraError}
        </p>
      )}

      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="Grocery preview"
            style={{
              width: "100%",
              borderRadius: "12px",
              marginBottom: "12px",
            }}
          />

          <button
            type="button"
            onClick={() => {
              clearPhoto();
              startCamera();
            }}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            📷 Retake Photo
          </button>

          <button
            type="button"
            onClick={clearPhoto}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            Remove Photo
          </button>

          <button
            type="button"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Identify Groceries
          </button>
        </div>
      )}
    </div>
  );
}