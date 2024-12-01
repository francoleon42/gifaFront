import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RutaProtegida = ({ children }) => {
  const { token } = useSelector((state) => state.user);

  return token ? children : <Navigate to="/" />;
};

export default RutaProtegida;
