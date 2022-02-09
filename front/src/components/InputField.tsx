import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React from "react";
import {
  FieldErrors,
  UseFormRegisterReturn,
} from "react-hook-form";

interface InputFieldProps {
  errors: FieldErrors;
  label: string;
  name: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  type?: string;
}

// see: https://www.nadershamma.dev/blog/2019/how-to-access-object-properties-dynamically-using-bracket-notation-in-typescript/
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const fieldErrors = getProperty(props.errors, props.name);
  return (
    <FormControl isInvalid={!!fieldErrors}>
      <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
      <Input
        id={props.name}
        type={props.type}
        placeholder={props.placeholder}
        {...props.register}
      />
      <FormErrorMessage>{fieldErrors && fieldErrors.message}</FormErrorMessage>
    </FormControl>
  );
};
