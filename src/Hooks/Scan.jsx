import { Html5QrcodeScanner } from "html5-qrcode";
const handleStartScan = (setScanResult, scannerRef) => {
  setScanResult(null);

  if (!scannerRef.current) {
    const html5QrCodeScanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 370, height: 370 },
      aspectRatio: 1.0,
      disableFlip: false,
    });

    const onScanSuccess = (decodedText) => {
      
      const decodedNumber = parseInt(decodedText, 10);

      if (!isNaN(decodedNumber)) {
        setScanResult(decodedNumber); 
        console.log("Número escaneado:", decodedNumber);
      } else if (decodedText.startsWith("data:image") || decodedText.length > 100) {
      
        console.log("Imagen escaneada en formato Base64");
       
        setScanResult(decodedText);
      } else {
        console.warn("El texto escaneado no es un número entero válido ni una imagen reconocible:", decodedText);
        setScanResult(decodedText);
      }

      html5QrCodeScanner.clear();
      scannerRef.current = null;
    };

    const onScanError = (error) => {
      console.warn("Error al escanear el código QR:", error);
    };

    html5QrCodeScanner.render(onScanSuccess, onScanError);
    scannerRef.current = html5QrCodeScanner;
  } else {
    scannerRef.current.clear();
    scannerRef.current.render(onScanSuccess, onScanError);
  }
};

export default handleStartScan;
