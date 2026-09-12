"use client";

import { useEffect, useRef, useState } from "react";
import {
  analyzeGroceryImage,
  importReceiptItems,
} from "@/lib/api";
import { ReceiptItem } from "@/types";

export default function ReceiptScanner() {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [detectedItems, setDetectedItems] = useState<ReceiptItem[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

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
    setDetectedItems([]);

    if (uploadRef.current) {
      uploadRef.current.value = "";
    }
  }

  async function analyzeReceipt() {
    if (!imageFile) {
      return;
    }

    try {
      setCameraError("");
      setAnalyzing(true);

      const items = await analyzeGroceryImage(
        imageFile,
        "receipt"
      );

      console.log("AI found receipt items:", items);

      setDetectedItems(items);
    } catch (error) {
      console.error("Receipt analysis failed:", error);

      setCameraError(
        error instanceof Error
          ? error.message
          : "Could not analyze receipt."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function addDetectedItems() {
    if (detectedItems.length === 0) {
      return;
    }

    try {
      setCameraError("");
      setSaving(true);

      await importReceiptItems(detectedItems);

      alert(
        `${detectedItems.length} groceries added to your fridge!`
      );

      setDetectedItems([]);
      removePhoto();
    } catch (error) {
      console.error("Failed to add groceries:", error);

      setCameraError(
        error instanceof Error
          ? error.message
          : "Could not add groceries."
      );
    } finally {
      setSaving(false);
    }
  }

  const primaryButtonStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "none",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const secondaryButtonStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #444",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  };

  return (
    <section
      style={{
        width: "100%",
        padding: "20px",
        border: "1px solid #333",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.025)",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "6px",
          fontSize: "21px",
        }}
      >
        Scan Receipt
      </h2>

      <p
        style={{
          color: "#888",
          lineHeight: 1.5,
          fontSize: "14px",
          marginTop: 0,
          marginBottom: "20px",
        }}
      >
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
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={startCamera}
            style={secondaryButtonStyle}
          >
            Open Camera
          </button>

          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            style={secondaryButtonStyle}
          >
            Upload Photo
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
              borderRadius: "16px",
              display: "block",
              marginBottom: "12px",
            }}
          />

          <button
            type="button"
            onClick={capturePhoto}
            style={{
              ...primaryButtonStyle,
              marginBottom: "10px",
            }}
          >
            Capture Receipt
          </button>

          <button
            type="button"
            onClick={stopCamera}
            style={secondaryButtonStyle}
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
            color: "#d66",
            marginTop: "14px",
            fontSize: "14px",
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
              borderRadius: "16px",
              marginBottom: "12px",
              background: "rgba(255,255,255,0.02)",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                removePhoto();
                startCamera();
              }}
              style={secondaryButtonStyle}
            >
              Retake
            </button>

            <button
              type="button"
              onClick={removePhoto}
              style={secondaryButtonStyle}
            >
              Remove
            </button>
          </div>

          <button
            type="button"
            onClick={analyzeReceipt}
            disabled={analyzing}
            style={{
              ...primaryButtonStyle,
              opacity: analyzing ? 0.6 : 1,
              cursor: analyzing ? "not-allowed" : "pointer",
            }}
          >
            {analyzing ? "Analyzing..." : "Analyze Receipt"}
          </button>

          {detectedItems.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                border: "1px solid #333",
                borderRadius: "16px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "12px",
                }}
              >
                Detected Groceries
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {detectedItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px",
                      border: "1px solid #333",
                      borderRadius: "12px",
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      {item.name}
                    </strong>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#888",
                      }}
                    >
                      {item.quantity}
                      {item.unit ? ` ${item.unit}` : ""}
                      {" • "}
                      {item.category}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addDetectedItems}
                disabled={saving}
                style={{
                  ...primaryButtonStyle,
                  marginTop: "16px",
                  opacity: saving ? 0.6 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving
                  ? "Adding..."
                  : "Add to Fridge"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}