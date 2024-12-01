import React, { useEffect, useState, useRef } from "react";
import handleStartScan from "../../Hooks/Scan";

import { useSelector } from "react-redux";
import "./styles/scannerQR.css";
import VerDetalleMantenimientoScan from "./VerDetalleMantenimientoScan";

export const ScannerQR = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, []);

  const handleIniciarEscaneo = () => {
    setScanResult(null); 
    setError(null); 
    handleStartScan(setScanResult, scannerRef);
  };

  const handleIrAtras = () => {
    setScanResult(null); 
    setError(null); 
  };

  const handleEscaneoInvalido = () => {
    setError("El código QR escaneado no es válido. Por favor, inténtelo nuevamente.");
    setScanResult(null); 
  };

  const handleValidarResultado = (result) => {
    if (result) {
      setScanResult(result); 
    } else {
      handleEscaneoInvalido(); 
    }
  };

  useEffect(() => {
    if (scanResult) {
      handleValidarResultado(scanResult);
    }
  }, [scanResult]);

  return (
    <div className="container-actualizarStock">
      <div className="container-subb">


        {scanResult && !error ? (
          <VerDetalleMantenimientoScan
            idVehiculo={scanResult}
            token={token}
            irAtras={handleIrAtras}
          />
        ) : (
          <>
            <button className="boton-inicio" onClick={handleIniciarEscaneo}>
              Iniciar escaneo
            </button>
            <div id="reader" style={{ width: "340px", height: "300px", marginTop: "7px" }}></div>
          </>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleIniciarEscaneo} className="boton-inicio">
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default ScannerQR;
