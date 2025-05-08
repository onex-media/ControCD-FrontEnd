import { Notify } from "quasar";

export const handleMessages = ({
  message,
  color,
  icon,
  position = "bottom",
}: {
  message: string;
  color: string;
  icon: string;
  position?:
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top"
    | "left"
    | "right"
    | "center";
}) => {
  Notify.create({
    message,
    color,
    icon,
    position,
  });
};
