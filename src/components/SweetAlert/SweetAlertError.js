import Swal from 'sweetalert2';

export const showErrorAlert = (titulo, texto ) => {
  Swal.fire({
    icon: "error",
    title:titulo,
    text: texto,
  });
};
