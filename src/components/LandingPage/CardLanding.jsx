import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import './CardLanding.css';

export const CardLanding = ({ titulo, imagen, desc }) => {
  return (
    <Card className="card-landing">
      <CardHeader className="card-header">
        <h4 className="card-title">{titulo}</h4>
      </CardHeader>
      <CardBody className="card-body">
        <Image
          alt="Imagen descriptiva"
          className="card-image"
          src={imagen}
          width={90}
          height={90}
        />
        <p className="card-desc">{desc}</p>
      </CardBody>
    </Card>
  );
};

export default CardLanding;
