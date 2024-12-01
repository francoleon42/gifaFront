export const pedirPermisoCamara = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          
          console.log("Acceso a la cámara concedido.");
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          document.body.appendChild(video); 
        })
        .catch((err) => {
          
          console.error("Acceso a la cámara denegado o error:", err);
        });
    } else {
      console.error("El navegador no soporta la API getUserMedia.");
    }
  };
  
 
  