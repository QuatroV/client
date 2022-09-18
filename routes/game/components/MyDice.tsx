import Dice from "./Dice";
import { useDrop } from "react-dnd";
import { forwardRef } from "react";

const MyDice = (props: { side: number; onClick?: () => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "dice",
    drop: () => {
      if (props.onClick) {
        props.onClick();
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return <Dice {...props} ref={drop} />;
};

export default MyDice;
