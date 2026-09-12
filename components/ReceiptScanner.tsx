"use client";

import { useEffect, useRef, useState } from "react";

export default function ReceiptScanner() {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    try {
      setCameraError("");

      if (!window.isSecureContext) {
        setCameraError(
          "Camera access requires HTTPS or localhost. Use the deployed Vercel site or localhost."
        );
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          "This browser does not support live camera access."
        );
        return;
      }

      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);

      requestAnimationFrame(() => {
        const video = videoRef.current;

        if (!video) {
          return;
        }

        video.srcObject = stream;

        video.onloadedmetadata = async () => {
          try {
            await video.play();
          } catch (error) {
            console.error("Video playback failed:", error);
            setCameraError(
              "Camera opened, but the live preview could not start."
            );
          }
        };
      });
    } catch (error) {
      console.error("Camera error:", error);

      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          setCameraError(
            "Camera permission was blocked. Allow camera access in your browser settings and try again."
          );
          return;
        }

        if (error.name === "NotFoundError") {
          setCameraError(
            "No camera was found on this device."
          );
          return;
        }

        if (error.name === "NotReadableError") {
          setCameraError(
            "Your camera is already being used by another app or browser tab."
          );
          return;
        }
      }

      setCameraError(
        "Could not open the camera. Check camera permissions and try again."
      );
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

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
      setCameraError("Camera preview is not ready yet.");
      return;
    }

    if (video.readyState < 2) {
      setCameraError(
        "Camera is still loading. Wait a moment and try again."
      );
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      setCameraError(
        "Camera image is not ready yet. Wait a moment and try again."
      );
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Could not capture the image.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Could not create the receipt photo.");
          return;
        }

        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }

        const file = new File(
          [blob],
          `receipt-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        setImageFile(file);
        setImageUrl(URL.createObjectURL(blob));

        stopCamera();
      },
      "image/jpeg",
      0.92
    );
  }

  function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    stopCamera();

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setCameraError("");
  }

  function removePhoto() {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageFile(null);
    setImageUrl(null);
    setCameraError("");

    if (uploadRef.current) {
      uploadRef.current.value = "";
    }
  }

  function analyzeReceipt() {
    if (!imageFile) {
      return;
    }

    console.log("Ready for receipt AI:", imageFile);
  }

  return (
    <div
      style={{
        maxWidth: "430px",
        margin: "30px auto",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "16px",
        backgroundColor: "white",
      }}
    >
      <h2 style={{ marginTop: 0 }}>
        Scan Receipt
      </h2>

      <p style={{ color: "#666" }}>
        Take a live photo of your receipt or upload an existing image.
      </p>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{ display: "none" }}
      />

      {!cameraActive && !imageUrl && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={startCamera}
            style={{
              width: "100%",
              padding: "16px",
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
              padding: "16px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            🖼️ Upload Photo
          </button>
        </div>
      )}

      {cameraActive && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              minHeight: "260px",
              maxHeight: "460px",
              objectFit: "cover",
              backgroundColor: "black",
              borderRadius: "12px",
              display: "block",
              marginBottom: "12px",
            }}
          />

          <button
            type="button"
            onClick={capturePhoto}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            📸 Capture Receipt
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
            Cancel Camera
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      {cameraError && (
        <p
          style={{
            color: "red",
            marginTop: "14px",
          }}
        >
          {cameraError}
        </p>
      )}

      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="Receipt preview"
            style={{
              width: "100%",
              maxHeight: "460px",
              objectFit: "contain",
              borderRadius: "12px",
              marginBottom: "12px",
            }}
          />

          <button
            type="button"
            onClick={() => {
              removePhoto();
              startCamera();
            }}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            📷 Retake
          </button>

          <button
            type="button"
            onClick={removePhoto}
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
            onClick={analyzeReceipt}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Analyze Receipt
          </button>
        </div>
      )}
    </div>
  );
}