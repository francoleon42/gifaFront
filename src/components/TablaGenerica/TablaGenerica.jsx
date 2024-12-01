import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import './styles/tablaGenerica.css';

export function TablaGenerica({ data, columns, renderCell, topContent }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 770);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="TableContainer">
      {topContent && <div className="mb-4">{topContent}</div>}
      {!isMobile ? (
        <Table aria-label="Tabla Genérica" isHeaderSticky>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "acciones" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No hay datos disponibles"} items={data}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell
                    data-label={columns.find(col => col.uid === columnKey)?.name}
                  >
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="CardContainer">
          {data.length === 0 ? (
            <div className="NoDataMessage">No hay datos disponibles</div>
          ) : (
            data.map((item) => (
              <div className="Card" key={item.key}>
                {columns.map((col) => (
                  <div className="CardItem" key={col.uid}>
                    <span className="CardLabel">{col.name}</span>
                    <span className="CardValue">
                      {renderCell(item, col.uid)}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TablaGenerica;
