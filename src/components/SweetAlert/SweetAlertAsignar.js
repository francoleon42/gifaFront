import Swal from 'sweetalert2';
import { showsuccessAlert } from './SweetAlertSucces';

export function SweetAlertAsignar({ choferId, vehiculosDisponibles, onAsignar }) {
  const handleAsignar = (vehiculoId) => {
    onAsignar(vehiculoId,choferId);
    Swal.close(); 
    showsuccessAlert("Vehículo asignado","El vehículo fue asignado correctamente")
  };
  

  Swal.fire({
    title: 'Seleccione el vehículo a asignar',
    html: `
      <select id="vehiculoSelect" class="swal2-input">
        <option value="">Seleccionar vehículo</option>
        ${vehiculosDisponibles.map(vehiculo => `
          <option value="${vehiculo.id}">${vehiculo.patente}</option>
        `).join('')}
      </select>
    `,
    showCancelButton: true,
    confirmButtonText: 'Asignar',
    preConfirm: () => {
      const vehiculoId = document.getElementById('vehiculoSelect').value;
      if (!vehiculoId) {
        Swal.showValidationMessage('Por favor, selecciona un vehículo');
        return false;
      }
      return vehiculoId;
    },
  }).then(result => {
    if (result.isConfirmed) {
      handleAsignar(result.value);
    }
  });
}
