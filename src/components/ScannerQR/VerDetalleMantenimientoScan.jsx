import React, { useEffect, useState } from 'react';
import { verMantenimientoPorVehiculo } from '../../services/mantenimientoService'; 
import { Button, Card, CardHeader, CardBody, CardFooter, Divider, Image } from '@nextui-org/react';
import mantenimientoImagen from '../../assets/Images/LogoNavBar.jpeg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

export const VerDetalleMantenimientoScan = ({ idVehiculo, token, irAtras }) => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMantenimientos = async () => {
      try {
        const response = await verMantenimientoPorVehiculo(idVehiculo, token); 
        if (response.mantenimientos.length > 0) {
          setMantenimientos(response.mantenimientos); 
        } else {
          setError("No se encontró ningún mantenimiento para este vehículo.");
        }
      } catch (error) {
        setError("Error al cargar los detalles del mantenimiento.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMantenimientos();
  }, [idVehiculo, token]);

  if (isLoading) return <p>Cargando detalles del mantenimiento...</p>;
  if (error) return <p>{error}</p>;
  if (mantenimientos.length === 0) return <p>No hay datos disponibles.</p>;

  return (
    <div>

      <div className="carousel-container">
        <Swiper 
          spaceBetween={40} 
          slidesPerView={1} 
          pagination={{ clickable: false }} 
          loop={true}  
          grabCursor={true}  
          centeredSlides={true} 
          speed={500}  
        >
          {mantenimientos.map((mantenimiento) => {
            const repuestosAgrupados = mantenimiento.itemUtilizado.reduce((acc, { item, cantidad }) => {
              if (!acc[item]) {
                acc[item] = cantidad;
              } else {
                acc[item] += cantidad;
              }
              return acc;
            }, {});

            return (
              <SwiperSlide key={mantenimiento.id}>
                <CardMantenimiento
                  mantenimiento={mantenimiento}
                  repuestosAgrupados={repuestosAgrupados}
                  onVolver={irAtras}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

function CardMantenimiento({ mantenimiento, repuestosAgrupados, onVolver }) {
  return (
    <Card className="max-w-[400px]" css={{ marginBottom: '20px' }}>
      <CardHeader className="flex gap-3">
        <Image
          alt="Imagen del mantenimiento"
          height={40}
          radius="sm"
          src={mantenimientoImagen}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md"><strong>Mantenimiento para Colectivo {mantenimiento.vehiculo.patente}</strong></p>
          <p className="text-small text-default-500">Realizado por: {mantenimiento.operador.usuario}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p><strong>Detalles del Vehículo:</strong></p>
        <p><strong>Patente:</strong> {mantenimiento.vehiculo.patente}</p>
        <p><strong>Antigüedad:</strong> {mantenimiento.vehiculo.antiguedad} años</p>
        <p><strong>Kilometraje:</strong> {mantenimiento.vehiculo.kilometraje} km</p>
        <p><strong>Estado de Habilitación:</strong> {mantenimiento.vehiculo.estadoDeHabilitacion}</p>
        <Divider />
        <p><strong>Fechas de Mantenimiento:</strong></p>
        <p><strong>Fecha de Inicio:</strong> {mantenimiento.fechaInicio}</p>
        <p><strong>Fecha de Finalización:</strong> {mantenimiento.fechaFinalizacion}</p>
        <Divider />
        <p><strong>Asunto:</strong> {mantenimiento.asunto}</p>
        <p><strong>Repuestos Utilizados:</strong></p>
        <ul>
          {Object.entries(repuestosAgrupados).map(([item, cantidad]) => (
            <li key={item}>{item} (Cantidad: {cantidad})</li>
          ))}
        </ul>
      </CardBody>
      <Divider />
      <CardFooter>
        <Button color="secondary" onClick={onVolver}>Volver</Button>
      </CardFooter>
    </Card>
  );
}

export default VerDetalleMantenimientoScan;
