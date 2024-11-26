import { Button } from "@mui/material";
import PropTypes from "prop-types";

const ActionButton = ({ text, color, variant = "contained", onClick }) => {
  return (
    <Button variant={variant} color={color} onClick={onClick}>
      {text}
    </Button>
  );
};

// PropTypes validation
ActionButton.propTypes = {
  text: PropTypes.string.isRequired, // Ensure text is a required string
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "error",
    "default",
    "info",
    "success",
    "warning",
  ]), // Restrict to MUI colors
  variant: PropTypes.oneOf(["text", "outlined", "contained"]), // Restrict to MUI button variants
  onClick: PropTypes.func.isRequired, // Ensure onClick is a required function
};

export default ActionButton;
