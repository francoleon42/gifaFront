
import { obtenerItems } from "../../services/inventarioService";


export const FetchItems = async (setItems, token) => {
    try {
      const items = await obtenerItems(token); 
      const mappedRows = items.map((item) => ({
        key: item.id,
        id: item.id,
        nombre: item.nombre,
      }));
      setItems(mappedRows);
    } catch (error) {
      console.error("Error al obtener los artículos:", error);
    }
  };
  
export default FetchItems;
