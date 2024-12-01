import React, { useState } from "react";
import { Card, CardHeader, CardBody, Button, Divider } from "@nextui-org/react";
import { QRCodeCanvas } from "qrcode.react";

function DetalleVehiculo({ vehiculo, irAtras }) {

  const handleDownloadQR = () => {
    const canvas = document.getElementById("qrCanvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QR_${vehiculo.patente}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };


  return (
    <Card className="py-4 max-w-[400px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Detalles del Vehículo</p>
      </CardHeader>
      <CardBody className="overflow-visible py-2 px-4">

        <Divider />

        <div className="mt-4">
          <p><strong>Patente:</strong> {vehiculo.patente}</p>
          <p><strong>Antigüedad:</strong> {vehiculo.antiguedad} años</p>
          <p><strong>Kilometraje inicial:</strong> {vehiculo.kilometrajeUsado} km</p>
          <p><strong>Kilometraje recorrido:</strong> {vehiculo.kilometrajeRecorridos} km</p>
          <p><strong>Kilometraje total:</strong> {vehiculo.kilometrajeTotal} km</p>
          <p><strong>Estado:</strong> {vehiculo.estado}</p>
        </div>

        <Divider className="my-4" />

        <div>
          <h5 className="font-semibold mb-2">Código QR</h5>
          <QRCodeCanvas
            id="qrCanvas"
            value={String(vehiculo.id)} 
            size={150}
            className="mb-4"
          />

          <Button size="sm" color="secondary" onClick={handleDownloadQR}>
            Descargar QR
          </Button>
        </div>

        <Divider />
      </CardBody>

      <Button className="m-4" color="danger" onClick={irAtras}>
        Volver
      </Button>
    </Card>
  );
}

export default DetalleVehiculo;
