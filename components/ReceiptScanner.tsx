"use client";

import { useEffect, useRef, useState } from "react";

export default function ReceiptScanner() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
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
    setStatusMessage("");
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function startCamera() {
    try {
      setCameraError("");
      setStatusMessage("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error(error);
      setCameraError(
        "Could not access the camera. Check your browser camera permissions."
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
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file = new File([blob], "receipt-photo.jpg", {
          type: "image/jpeg",
        });

        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }

        setImageFile(file);
        setImageUrl(URL.createObjectURL(blob));
        setStatusMessage("");

        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  }

  function clearImage() {
    setImageFile(null);

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageUrl(null);
    setStatusMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleAnalyze() {
    if (!imageFile) {
      return;
    }

    setIsAnalyzing(true);
    setStatusMessage("Analyzing your receipt...");

    // Temporary placeholder until AI is connected
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Ready to analyze receipt:", imageFile.name);

    setIsAnalyzing(false);
    setStatusMessage("Receipt ready for review.");
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
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "8px" }}>
        Scan Receipt
      </h2>

      <p
        style={{
          marginTop: 0,
          marginBottom: "20px",
          color: "#666",
        }}
      >
        Take a photo of your grocery receipt or upload an existing image.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {!imageUrl && !cameraActive && (
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
              padding: "18px",
              borderRadius: "12px",
              border: "2px dashed #aaa",
              backgroundColor: "#fafafa",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            📷 Open Camera
          </button>

          <button
            type="button"
            onClick={openFilePicker}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "12px",
              border: "1px solid #bbb",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "16px",
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
            playsInline
            style={{
              width: "100%",
              borderRadius: "12px",
              marginBottom: "12px",
            }}
          />

          <button
            type="button"
            onClick={capturePhoto}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              marginBottom: "10px",
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
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {cameraError && (
        <p style={{ color: "red", marginTop: "12px" }}>
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
              maxHeight: "380px",
              objectFit: "contain",
              borderRadius: "12px",
              border: "1px solid #ddd",
              marginBottom: "16px",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <button
              type="button"
              onClick={startCamera}
              disabled={isAnalyzing}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #bbb",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              Retake
            </button>

            <button
              type="button"
              onClick={openFilePicker}
              disabled={isAnalyzing}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #bbb",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              Change File
            </button>
          </div>

          <button
            type="button"
            onClick={clearImage}
            disabled={isAnalyzing}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #bbb",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Remove Photo
          </button>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isAnalyzing ? "not-allowed" : "pointer",
            }}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Receipt"}
          </button>

          {statusMessage && (
            <p
              style={{
                marginTop: "14px",
                marginBottom: 0,
                textAlign: "center",
                color: "#555",
              }}
            >
              {statusMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}