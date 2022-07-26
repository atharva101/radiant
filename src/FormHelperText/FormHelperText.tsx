import * as React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { OverridableComponent } from "@mui/types";
import composeClasses from "@mui/base/composeClasses";
import { styled, useThemeProps } from "../styles";
import {
  FormHelperTextProps,
  FormHelperTextTypeMap,
} from "./FormHelperTextProps";
import { getFormHelperTextUtilityClass } from "./formHelperTextClasses";

const useUtilityClasses = () => {
  const slots = {
    root: ["root"],
  };

  return composeClasses(slots, getFormHelperTextUtilityClass, {});
};

const FormHelperTextRoot = styled("p", {
  name: "RadFormHelperText",
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{ ownerState: FormHelperTextProps }>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontFamily: theme.vars.fontFamily.body,
  fontSize: `var(--FormHelperText-fontSize, ${theme.vars.fontSize.sm})`,
  lineHeight: theme.vars.lineHeight.sm,
  color: `var(--FormHelperText-color, ${theme.vars.palette.text.secondary})`,
  margin: "var(--FormHelperText-margin, 0.25rem 0 0 0)",
}));

const FormHelperText = React.forwardRef(function FormHelperText(inProps, ref) {
  const props = useThemeProps<
    typeof inProps & { component?: React.ElementType }
  >({
    props: inProps,
    name: "RadFormHelperText",
  });

  const { children, className, component, ...other } = props;

  const ownerState = {
    ...props,
  };

  const classes = useUtilityClasses();

  return (
    <FormHelperTextRoot
      ref={ref}
      as={component}
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      {...other}
    >
      {children}
    </FormHelperTextRoot>
  );
}) as OverridableComponent<FormHelperTextTypeMap>;

FormHelperText.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export default FormHelperText;
