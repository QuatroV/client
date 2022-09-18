import Dice from "./Dice";
import { useDrag } from "react-dnd";
import { useEffect } from "react";

const CurrentDice = (props: { side: number; onClick?: () => void }) => {
  const [, drag] = useDrag(() => ({
    type: "dice",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return <Dice {...props} ref={drag} />;
};

export default CurrentDice;
