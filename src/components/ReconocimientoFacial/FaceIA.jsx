import * as faceapi from 'face-api.js';
import { useEffect, useRef, useState } from 'react';
import Loader from '../Loader/Loader';
import { Button } from "@nextui-org/react";

const FaceIA = ({ onResult, handleIrAtras }) => {
  const [modelsCargados, setModelsCargados] = useState(false);
  const [resultadoComparacion, setResultadoComparacion] = useState(null);
  const [showRetryOptions, setShowRetryOptions] = useState(false); 
  const videoRef = useRef();
  const imgRef = useRef(); 
  const deteccionInteravaloRef = useRef(null);

  useEffect(() => {
    const cargarModelos = async () => {
      const MODEL_URL = '/models';
      console.log('Cargando modelos...');
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      console.log('Modelos cargados');
      setModelsCargados(true);
    };

    cargarModelos();
  }, []);

  const comenzarVideo = () => {
    console.log('Intentando acceder a la cámara...');
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        console.log('Cámara accesible, iniciando transmisión...');
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error al acceder a la cámara:', err);
        alert('No se puede acceder a la cámara. Verifica los permisos y el acceso HTTPS.');
      });
  };

  const cargarImagenAdmin = async () => {
    const image = new Image();
    image.src = 'src/assets/Images/admin.jpeg'; 
    await image.decode();
    imgRef.current = image;
  };

  const compararCaras = async (videoFace) => {
    if (imgRef.current && videoFace && modelsCargados) {
      console.log('Comparando rostros...');
    
      const imagenStatica = await faceapi
        .detectSingleFace(imgRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!imagenStatica) {
        console.log('No se detectó ningún rostro en la imagen estática');
        return;
      }

      const distance = faceapi.euclideanDistance(
        videoFace.descriptor,
        imagenStatica.descriptor
      );

      if (distance < 0.6) {
        console.log('Las caras coinciden!');
        setResultadoComparacion('Coincidencia');
        onResult('Coincidencia');
        clearInterval(deteccionInteravaloRef.current);
      } else {
        console.log('Las caras no coinciden');
        setResultadoComparacion('No Coincidencia');
        onResult('No coincidencia');
        setShowRetryOptions(true); 
        clearInterval(deteccionInteravaloRef.current); 
      }
    }
  };

  useEffect(() => {
    const detectFaceAndCompare = async () => {
      if (modelsCargados && videoRef.current) {
        console.log('Intentando detectar rostro en el video...');
        const videoFace = await faceapi
          .detectSingleFace(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (videoFace) {
          console.log('Rostro detectado en video:', videoFace);
          await compararCaras(videoFace);
        } else {
          console.log('No se detectó ningún rostro en el video');
        }
      }
    };

    if (modelsCargados) {
      comenzarVideo();
      cargarImagenAdmin(); 
      deteccionInteravaloRef.current = setInterval(detectFaceAndCompare, 1000);
    }

    return () => {
      clearInterval(deteccionInteravaloRef.current); 
    };
  }, [modelsCargados]);


  const handleGoBack = () => {
    handleIrAtras()
  };

  return (
    <div>
      {modelsCargados ? (
        <div>
          <video ref={videoRef} autoPlay muted width="320" height="240" style={{ border: '1px solid black' }} />
          {showRetryOptions && (
            <div>
                <br />
                {resultadoComparacion && <p>Usuario no autorizado</p>}
              <Button color='danger' onClick={handleGoBack}>Ir hacia Atrás</Button>
            </div>
          )}
        </div>
      ) : (
        <>
        <Loader/>
        <p>Espere un momento...</p>
        </>
      )}
    </div>
  );
};

export default FaceIA;
