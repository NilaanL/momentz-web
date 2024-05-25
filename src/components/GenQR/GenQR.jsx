import React, { useState, useEffect } from "react";

const GenQR = () => {
  const [qrImg, setQrImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState("www.momentz.com");
  const [qrSize, setQrSize] = useState("150");

  useEffect(() => {
    const generateQrCode = async () => {
      setLoading(true);
      try {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${qrData}`;
        setQrImg(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
      } finally {
        setLoading(false);
      }
    };

    generateQrCode();
  }, [qrData, qrSize]); // The effect will run when qrData or qrSize changes

  return (
    <div className="app-container">
      <h1>QR Code Generator</h1>
      {loading && <p>Loading... Please wait</p>}
      {qrImg && <img src={qrImg} alt="QR Code" className="qr-img" />}
      <div className="input-container">
        <input
          type="text"
          value={qrData}
          onChange={(e) => setQrData(e.target.value)}
          id="dataInput"
          placeholder="Enter event code"
        />
        <button
          className="generate-button"
          onClick={() => setQrData(qrData)}
        >
          Generate QR Code
        </button>
        <button className="clear-button" onClick={() => setQrData("")}>
          Clear
        </button>
        <button className="download-button">Download QR Code</button>
        <input
          type="number"
          value={qrSize}
          onChange={(e) => setQrSize(e.target.value)}
        />
        <button onClick={() => setQrSize("")}>Clear</button>
      </div>
    </div>
  );
};

export default GenQR;
