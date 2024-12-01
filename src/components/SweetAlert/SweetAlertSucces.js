import Swal from 'sweetalert2';

export const showsuccessAlert = ( titulo, texto ) => {
  Swal.fire({
    icon: "success",
    title:titulo,
    text: texto,
  });
};
