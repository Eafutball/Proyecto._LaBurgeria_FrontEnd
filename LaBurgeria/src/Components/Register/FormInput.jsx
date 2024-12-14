import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import PropTypes from "prop-types"; // Importar PropTypes
import React from "react"
import { Controller } from "react-hook-form";
const FormInput = ({
  control,
  name,
  label,
  type = "text",
  showPassword,
  onTogglePasswordVisibility,
  rules,
  InputLabelProps,
  disabled,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          InputLabelProps={InputLabelProps}
          disabled={disabled}
          error={!!error}
          helperText={error ? error.message : ""}
          fullWidth
          variant="outlined"
          InputProps={
            type === "password"
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={onTogglePasswordVisibility} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
        />
      )}
    />
  );
};

FormInput.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  showPassword: PropTypes.bool,
  onTogglePasswordVisibility: PropTypes.func,
  rules: PropTypes.object,
  InputLabelProps: PropTypes.object,
  disabled: PropTypes.bool,
};

FormInput.defaultProps = {
  type: "text",
  showPassword: false,
  onTogglePasswordVisibility: null,
  rules: {},
  InputLabelProps: {},
  disabled: false,
};

export default FormInput;
