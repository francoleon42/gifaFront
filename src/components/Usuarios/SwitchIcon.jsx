import React from "react";
import {Switch} from "@nextui-org/react";

export default function IconSwitch() {
  const [isSelected, setIsSelected] = React.useState(true);

  return (
    <div className="flex flex-col gap-2">
      <Switch isSelected={isSelected} onValueChange={setIsSelected}>
      </Switch>  
    </div>
  )  
}
