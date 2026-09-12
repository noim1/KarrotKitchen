"use client";

import { useRef, useState } from "react";

export default function ReceiptScanner() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const url = URL.createObjectURL(file);
    setImageUrl(url);

    setStatusMessage("");
  }

  function openCameraOrFilePicker() {
    fileInputRef.current?.click();
  }

  function clearImage() {
    setImageFile(null);
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

    // Temporary fake delay until AI is connected
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Ready to analyze:", imageFile.name);

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
      <h2
        style={{
          marginTop: 0,
          marginBottom: "8px",
        }}
      >
        Scan Receipt
      </h2>

      <p
        style={{
          marginTop: 0,
          marginBottom: "20px",
          color: "#666",
        }}
      >
        Take a photo of your grocery receipt or upload one from your device.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      {!imageUrl && (
        <button
          type="button"
          onClick={openCameraOrFilePicker}
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
          📷 Take or Choose Receipt Photo
        </button>
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
              onClick={openCameraOrFilePicker}
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
              Change Photo
            </button>

            <button
              type="button"
              onClick={clearImage}
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
              Remove
            </button>
          </div>

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
