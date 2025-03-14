import { useState, useRef } from "react";
import { Input } from "./components/Input";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import Logo from "./assets/Logo.svg";
import LogoSmall from "./assets/Logo-small.svg";
import download from "./assets/Load_circle_duotone.svg";
import clipboard from "./assets/link_alt.svg";
import { Toast } from "./components/Toast";
function App() {
  const [value, setValue] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [toast, setToast] = useState(false);
  const generateQRCode = (event) => {
    event.preventDefault();
    setQrCode(value);
  };

  const qrRef = useRef();

  const downloadQRCode = () => {
    toPng(qrRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qrcode.png";
        link.click();
      })
      .catch((err) => {
        console.error("Error generating QR code image", err);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCode);
    setToast(true);
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };
  return (
    <div className="bg-red-400 flex flex-col items-center justify-center h-screen">
      {!qrCode ? (
        <section className="flex flex-col items-center justify-center gap-15">
          <h1 className="h-10 w-screen flex justify-center">
            <img src={Logo} alt="logo" />
          </h1>
          <form
            className="flex justify-between px-5 py-1 border-3 border-red-500 rounded-2xl w-9/10 max-w-lg"
            onSubmit={generateQRCode}
          >
            <Input setValue={setValue} className="text-red-500" />
            <button
              className="bg-red-500 px-2 py-2 rounded-4xl w-1/4 text-red-white"
              type="submit"
              aria-label="Generate QR code"
              disabled={!value}
            >
              QR code
            </button>
          </form>
        </section>
      ) : (
        <section
          aria-label="QR code generated"
          className="flex flex-col justify-start h-screen pt-15 gap-20 items-center"
        >
          <h2>
            <img src={LogoSmall} alt="logo" />
          </h2>
          <div
            ref={qrRef}
            className="bg-red-500 w-80 h-80 py-8 rounded-[100%]"
          >
            <div className="mx-auto flex justify-center items-center bg-white rounded-3xl overflow-hidden w-64 h-64">
              <QRCode value={qrCode} size={220} />
            </div>
          </div>
          <div className="w-screen max-w-xs md:max-w-md flex justify-between">
            <button
              aria-label="Download QR code"
              onClick={downloadQRCode}
              className="flex gap-2 justify-center bg-red-500 px-2 py-4 rounded-xl w-36 md:w-48 text-white"
            >
              Download
              <img src={download} alt="QrDownload" />
            </button>
            <button
              aria-label="Share QR code"
              className="flex gap-2 justify-center items-center bg-red-500 px-2 py-4 rounded-xl w-36 md:w-48 text-white"
              onClick={copyToClipboard}
            >
              Share
              <img src={clipboard} alt="Share" />
            </button>
          </div>
          <button
            onClick={() => setQrCode("")}
            className="bg-red-600 px-2 py-4 rounded-xl text-white w-16 absolute top-2 left-4"
            aria-label="Generate another QR code"
          >
            Back
          </button>
          <Toast toast={toast} />
        </section>
      )}
    </div>
  );
}

export default App;
