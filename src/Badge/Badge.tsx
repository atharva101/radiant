import { unstable_composeClasses as composeClasses } from "@mui/base";
import BadgeUnstyled from "@mui/base/BadgeUnstyled";
import { OverridableComponent } from "@mui/types";
import {
  unstable_capitalize as capitalize,
  usePreviousProps,
} from "@mui/utils";
import clsx from "clsx";
import PropTypes from "prop-types";
import * as React from "react";
import styled from "../styles/styled";
import useThemeProps from "../styles/useThemeProps";
import shouldSpreadAdditionalProps from "../utils/shouldSpreadAdditionalProps";
import badgeClasses, { getBadgeUtilityClass } from "./badgeClasses";
import { BadgeProps, BadgeTypeMap } from "./BadgeProps";

const useUtilityClasses = (ownerState: BadgeProps) => {
  const { color, variant, size, anchorOrigin, invisible } = ownerState;

  const slots = {
    root: ["root"],
    badge: [
      "badge",
      invisible && "invisible",
      anchorOrigin &&
        `anchorOrigin${capitalize(anchorOrigin.vertical)}${capitalize(
          anchorOrigin.horizontal
        )}`,
      variant && `variant${capitalize(variant)}`,
      color && `color${capitalize(color)}`,
      size && `size${capitalize(size)}`,
    ],
  };

  return composeClasses(slots, getBadgeUtilityClass, {});
};

const BadgeRoot = styled("span", {
  name: "JoyBadge",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: BadgeProps }>(({ theme, ownerState }) => ({
  ...(ownerState.size === "sm" && {
    "--Badge-minHeight": "1.25rem", //0.5
    ...(ownerState.badgeContent && {
      "--Badge-minHeight": "1.25rem", //1
    }),
    "--Badge-paddingX": "0.25rem", //0.25
    fontSize: theme.vars.fontSize.sm, //xs
  }),
  ...(ownerState.size === "md" && {
    "--Badge-minHeight": "1.5rem", //0.75
    ...(ownerState.badgeContent && {
      "--Badge-minHeight": "1.5rem", //1.25
    }),
    "--Badge-paddingX": "0.5rem", //0.375
    fontSize: theme.vars.fontSize.md, //sm
  }),
  ...(ownerState.size === "lg" && {
    "--Badge-minHeight": "2rem", //1
    ...(ownerState.badgeContent && {
      "--Badge-minHeight": "2rem", //1.5
    }),
    "--Badge-paddingX": "0.75rem", //0.5
    fontSize: theme.vars.fontSize.lg, //,md
  }),
  "--Badge-ringSize": "2px",
  "--Badge-ring": `0 0 0 var(--Badge-ringSize) var(--Badge-ringColor, ${theme.vars.palette.background.body})`,
  position: "relative",
  display: "inline-flex",
  // For correct alignment with the text.
  verticalAlign: "middle",
  flexShrink: 0,
}));

const BadgeBadge = styled("span", {
  name: "JoyBadge",
  slot: "Badge",
  overridesResolver: (props, styles) => styles.badge,
})<{ ownerState: BadgeProps }>(({ theme, ownerState }) => {
  const inset = {
    top: ownerState.badgeInset,
    left: ownerState.badgeInset,
    bottom: ownerState.badgeInset,
    right: ownerState.badgeInset,
  };

  if (typeof ownerState.badgeInset === "string") {
    const insetValues = ownerState.badgeInset.split(" ");
    if (insetValues.length > 1) {
      inset.top = insetValues[0];
      inset.right = insetValues[1];
      if (insetValues.length === 2) {
        inset.bottom = insetValues[0];
        inset.left = insetValues[1];
      }
      if (insetValues.length === 3) {
        inset.left = insetValues[1];
        inset.bottom = insetValues[2];
      }
      if (insetValues.length === 4) {
        inset.bottom = insetValues[2];
        inset.left = insetValues[3];
      }
    }
  }
  const translateY =
    ownerState.anchorOrigin?.vertical === "top"
      ? "translateY(-50%)"
      : "translateY(50%)";
  const translateX =
    ownerState.anchorOrigin?.horizontal === "left"
      ? "translateX(-50%)"
      : "translateX(50%)";
  const transformOriginY =
    ownerState.anchorOrigin?.vertical === "top" ? "0%" : "100%";
  const transformOriginX =
    ownerState.anchorOrigin?.horizontal === "left" ? "0%" : "100%";
  return [
    {
      display: "inline-flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      position: "absolute",
      boxSizing: "border-box",
      boxShadow: "var(--Badge-ring)",
      fontFamily: theme.vars.fontFamily.body,
      fontWeight: theme.vars.fontWeight.md,
      lineHeight: 1,
      padding:
        "calc(var(--Badge-paddingX) / 2 - var(--variant-outlinedBorderWidth, 0px)) calc(var(--Badge-paddingX) - var(--variant-outlinedBorderWidth, 0px))",
      minHeight: "var(--Badge-minHeight)",
      minWidth: "var(--Badge-minHeight)",
      borderRadius: "var(--Badge-radius, var(--Badge-minHeight))",
      zIndex: 1,
      transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      ...(ownerState.variant === "outlined" && {
        backgroundColor: theme.vars.palette.background.body,
      }),
      [ownerState.anchorOrigin!.vertical]:
        inset[ownerState.anchorOrigin!.vertical],
      [ownerState.anchorOrigin!.horizontal]:
        inset[ownerState.anchorOrigin!.horizontal],
      transform: `scale(1) ${translateX} ${translateY}`,
      transformOrigin: `${transformOriginX} ${transformOriginY}`,
      [`&.${badgeClasses.invisible}`]: {
        transform: `scale(0) ${translateX} ${translateY}`,
      },
      ...(ownerState.invisible && {
        transition: "transform 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      }),
    },
    theme.variants[ownerState.variant!]?.[ownerState.color!],
  ];
});

const Badge = React.forwardRef(function Badge(inProps, ref) {
  const props = useThemeProps<typeof inProps & BadgeProps>({
    props: inProps,
    name: "JoyBadge",
  });
  const {
    anchorOrigin: anchorOriginProp = {
      vertical: "top",
      horizontal: "right",
    },
    badgeInset: badgeInsetProp = 0,
    className,
    component = "span",
    components = {},
    componentsProps = {},
    size: sizeProp = "md",
    color: colorProp = "primary",
    invisible: invisibleProp = false,
    max,
    badgeContent: badgeContentProp = "",
    showZero = false,
    variant: variantProp = "solid",
    ...other
  } = props;

  const prevProps = usePreviousProps({
    anchorOrigin: anchorOriginProp,
    size: sizeProp,
    badgeInset: badgeInsetProp,
    color: colorProp,
    variant: variantProp,
  });

  let invisible = invisibleProp;

  if (
    invisibleProp === false &&
    ((badgeContentProp === 0 && !showZero) || badgeContentProp == null)
  ) {
    invisible = true;
  }

  const {
    color = colorProp,
    size = sizeProp,
    anchorOrigin = anchorOriginProp,
    variant = variantProp,
    badgeInset = badgeInsetProp,
  }: {
    size?: BadgeProps["size"];
    color?: BadgeProps["color"];
    anchorOrigin?: BadgeProps["anchorOrigin"];
    variant?: BadgeProps["variant"];
    badgeInset?: BadgeProps["badgeInset"];
  } = invisible ? prevProps : props;

  const ownerState = {
    ...props,
    anchorOrigin,
    badgeInset,
    variant,
    invisible,
    color,
    size,
  };
  const classes = useUtilityClasses(ownerState);
  const displayValue =
    max !== undefined && badgeContentProp && Number(badgeContentProp) > max
      ? `${max}+`
      : badgeContentProp;

  return (
    <BadgeUnstyled
      ref={ref}
      invisible={invisibleProp}
      badgeContent={displayValue}
      showZero={showZero}
      max={max}
      {...other}
      components={{
        Root: BadgeRoot,
        Badge: BadgeBadge,
        ...components,
      }}
      className={clsx(className, classes.root, componentsProps.root?.className)}
      componentsProps={{
        root: {
          ...componentsProps.root,
          ...(shouldSpreadAdditionalProps(components.Root) && {
            as: component,
            ownerState: {
              anchorOrigin,
              color,
              variant,
              badgeInset,
              size,
            },
          }),
        },
        badge: {
          ...componentsProps.badge,
          className: clsx(classes.badge, componentsProps.badge?.className),
          ...(shouldSpreadAdditionalProps(components.Badge) && {
            ownerState: {
              anchorOrigin,
              color,
              variant,
              badgeInset,
              size,
            },
          }),
        },
      }}
    />
  );
}) as OverridableComponent<BadgeTypeMap>;

Badge.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The anchor of the badge.
   * @default {
   *   vertical: 'top',
   *   horizontal: 'right',
   * }
   */
  anchorOrigin: PropTypes.shape({
    horizontal: PropTypes.oneOf(["left", "right"]).isRequired,
    vertical: PropTypes.oneOf(["bottom", "top"]).isRequired,
  }),
  /**
   * The content rendered within the badge.
   */
  badgeContent: PropTypes.node,
  /**
   * The inset of the badge. Support shorthand syntax as described in https://developer.mozilla.org/en-US/docs/Web/CSS/inset.
   * @default 0
   */
  badgeInset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The badge will be added relative to this node.
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * @default 'primary'
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf([
      "danger",
      "info",
      "neutral",
      "primary",
      "success",
      "warning",
    ]),
    PropTypes.string,
  ]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The components used for each slot inside the Badge.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  components: PropTypes.shape({
    Badge: PropTypes.elementType,
    Root: PropTypes.elementType,
  }),
  /**
   * The props used for each slot inside the Badge.
   * @default {}
   */
  componentsProps: PropTypes.shape({
    badge: PropTypes.object,
    root: PropTypes.object,
  }),
  /**
   * If `true`, the badge is invisible.
   * @default false
   */
  invisible: PropTypes.bool,
  /**
   * Max count to show.
   * @default 99
   */
  max: PropTypes.number,
  /**
   * Controls whether the badge is hidden when `badgeContent` is zero.
   * @default false
   */
  showZero: PropTypes.bool,
  /**
   * The size of the component.
   * @default 'md'
   */
  size: PropTypes.oneOf(["sm", "md", "lg"]),
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
  /**
   * The variant to use.
   * @default 'solid'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(["outlined", "plain", "soft", "solid"]),
    PropTypes.string,
  ]),
} as any;

export default Badge;
