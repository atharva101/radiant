import { deepmerge } from "@mui/utils";
import {
  BreakpointsOptions,
  SpacingOptions,
  createBreakpoints,
  createSpacing,
  unstable_createGetCssVar as systemCreateGetCssVar,
  colorChannel,
} from "@mui/system";
import colors from "../colors";
import { DefaultColorScheme, ExtendedColorScheme } from "./types/colorScheme";
import {
  ColorSystem,
  ColorPaletteProp,
  PaletteRange,
} from "./types/colorSystem";
import { Focus } from "./types/focus";
import { TypographySystem, FontSize } from "./types/typography";
import {
  Variants,
  VariantOverrides,
  ColorInversionConfig,
} from "./types/variants";
import { Theme, ThemeCssVar, ThemeScales } from "./types";
import { Components } from "./components";
import { generateUtilityClass } from "../className";
import { createVariant } from "./variantUtils";

type Partial2Level<T> = {
  [K in keyof T]?: T[K] extends Record<any, any>
    ? {
        [J in keyof T[K]]?: T[K][J];
      }
    : T[K];
};

type Partial3Level<T> = {
  [K in keyof T]?: {
    [J in keyof T[K]]?: T[K][J] extends Record<any, any>
      ? {
          [P in keyof T[K][J]]?: T[K][J][P];
        }
      : T[K][J];
  };
};

export interface ColorSystemOptions extends Partial3Level<ColorSystem> {}

// Use Partial2Level instead of PartialDeep because nested value type is CSSObject which does not work with PartialDeep.
export interface CssVarsThemeOptions extends Partial2Level<ThemeScales> {
  /**
   * Prefix of the generated CSS variables
   * @default 'rad'
   * @example extendTheme({ cssVarPrefix: 'foo-bar' })
   * // { ..., typography: { body1: { fontSize: 'var(--foo-bar-fontSize-md)' } }, ... }
   *
   * @example <caption>Provides empty string ('') to remove the prefix</caption>
   * extendTheme({ cssVarPrefix: 'foo-bar' })
   * // { ..., typography: { body1: { fontSize: 'var(--fontSize-md)' } }, ... }
   */
  cssVarPrefix?: string;
  focus?: Partial<Focus>;
  typography?: Partial<TypographySystem>;
  variants?: Partial2Level<Variants>;
  colorInversion?: Partial2Level<VariantOverrides>;
  colorInversionConfig?: ColorInversionConfig;
  breakpoints?: BreakpointsOptions;
  spacing?: SpacingOptions;
  components?: Components<Theme>;
  colorSchemes?: Partial<
    Record<DefaultColorScheme | ExtendedColorScheme, ColorSystemOptions>
  >;
}

export const createGetCssVar = (cssVarPrefix = "rad") =>
  systemCreateGetCssVar<ThemeCssVar>(cssVarPrefix);

export default function extendTheme(themeOptions?: CssVarsThemeOptions): Theme {
  const {
    cssVarPrefix = "rad",
    breakpoints,
    spacing,
    components: componentsInput,
    variants: variantsInput,
    ...scalesInput
  } = themeOptions || {};
  const getCssVar = createGetCssVar(cssVarPrefix);

  const createLightModeVariantVariables = (color: ColorPaletteProp) => ({
    plainColor: getCssVar(`palette-${color}-600`),
    plainHoverBg: getCssVar(`palette-${color}-100`),
    plainActiveBg: `#A1A1A1`, //getCssVar(`palette-${color}-200`),
    plainDisabledColor: `#A1A1A1`, // getCssVar(`palette-${color}-200`),

    outlinedColor: getCssVar(`palette-${color}-500`),
    outlinedBorder: getCssVar(`palette-${color}-500`), //200
    outlinedHoverBg: getCssVar(`palette-${color}-50`), //100
    outlinedHoverBorder: getCssVar(`palette-${color}-500`), //300
    outlinedActiveBg: getCssVar(`palette-${color}-200`),
    outlinedDisabledColor: `#A1A1A1`, // getCssVar(`palette-${color}-100`),
    outlinedDisabledBorder: `#A1A1A1`, // getCssVar(`palette-${color}-100`),

    softColor: getCssVar(`palette-${color}-700`), //600
    softBg: getCssVar(`palette-${color}-100`),
    softHoverBg: getCssVar(`palette-${color}-200`),
    softActiveBg: getCssVar(`palette-${color}-300`),
    softDisabledColor: `#A1A1A1`, // getCssVar(`palette-${color}-300`),
    softDisabledBg: `#A1A1A1`, // getCssVar(`palette-${color}-50`),

    solidColor: "#fff",
    solidBg: getCssVar(`palette-${color}-500`),
    solidHoverBg: getCssVar(`palette-${color}-600`),
    solidActiveBg: getCssVar(`palette-${color}-800`), //700
    solidDisabledColor: `#A1A1A1`, // `#fff`,
    solidDisabledBg: `#F2F2F2`, // getCssVar(`palette-${color}-200`),

    // overrideTextPrimary: getCssVar(`palette-${color}-700`),
    // overrideTextSecondary: getCssVar(`palette-${color}-500`),
    // overrideTextTertiary: getCssVar(`palette-${color}-400`),
  });

  const createDarkModeVariantVariables = (color: ColorPaletteProp) => ({
    plainColor: getCssVar(`palette-${color}-300`),
    plainHoverBg: getCssVar(`palette-${color}-800`),
    plainActiveBg: getCssVar(`palette-${color}-700`),
    plainDisabledColor: getCssVar(`palette-${color}-800`),

    outlinedColor: getCssVar(`palette-${color}-200`),
    outlinedBorder: getCssVar(`palette-${color}-700`),
    outlinedHoverBg: getCssVar(`palette-${color}-800`),
    outlinedHoverBorder: getCssVar(`palette-${color}-600`),
    outlinedActiveBg: getCssVar(`palette-${color}-900`),
    outlinedDisabledColor: getCssVar(`palette-${color}-800`),
    outlinedDisabledBorder: getCssVar(`palette-${color}-800`),

    softColor: getCssVar(`palette-${color}-200`),
    softBg: getCssVar(`palette-${color}-900`),
    softHoverBg: getCssVar(`palette-${color}-800`),
    softActiveBg: getCssVar(`palette-${color}-700`),
    softDisabledColor: getCssVar(`palette-${color}-800`),
    softDisabledBg: getCssVar(`palette-${color}-900`),

    solidColor: `#fff`,
    solidBg: getCssVar(`palette-${color}-600`),
    solidHoverBg: getCssVar(`palette-${color}-700`),
    solidActiveBg: getCssVar(`palette-${color}-800`),
    solidDisabledColor: `#fff`,
    solidDisabledBg: getCssVar(`palette-${color}-300`),

    // overrideTextPrimary: getCssVar(`palette-${color}-200`),
    // overrideTextSecondary: getCssVar(`palette-${color}-400`),
    // overrideTextTertiary: getCssVar(`palette-${color}-500`),
  });

  const lightColorSystem = {
    palette: {
      mode: "light",
      primary: {
        ...colors.blue,
        ...createLightModeVariantVariables("primary"),
      },
      neutral: {
        ...colors.grey,
        plainColor: getCssVar(`palette-neutral-700`), //800
        plainHoverColor: getCssVar(`palette-neutral-900`),
        plainHoverBg: getCssVar(`palette-neutral-100`),
        plainActiveBg: getCssVar(`palette-neutral-200`),
        plainDisabledColor: getCssVar(`palette-neutral-300`),

        outlinedColor: `#000`, // getCssVar(`palette-neutral-800`),
        outlinedBorder: getCssVar(`palette-neutral-200`),
        outlinedHoverColor: getCssVar(`palette-neutral-900`),
        outlinedHoverBg: getCssVar(`palette-neutral-50`), //100
        outlinedHoverBorder: getCssVar(`palette-neutral-300`),
        outlinedActiveBg: getCssVar(`palette-neutral-200`),
        outlinedDisabledColor: getCssVar(`palette-neutral-300`),
        outlinedDisabledBorder: getCssVar(`palette-neutral-100`),

        softColor: getCssVar(`palette-neutral-700`), //800
        softBg: getCssVar(`palette-neutral-100`),
        softHoverColor: getCssVar(`palette-neutral-900`),
        softHoverBg: getCssVar(`palette-neutral-200`),
        softActiveBg: getCssVar(`palette-neutral-300`),
        softDisabledColor: getCssVar(`palette-neutral-500`), //300
        softDisabledBg: getCssVar(`palette-neutral-50`),

        solidColor: getCssVar(`palette-common-white`),
        solidBg: getCssVar(`palette-neutral-100`), //600
        solidHoverBg: getCssVar(`palette-neutral-700`),
        solidActiveBg: getCssVar(`palette-neutral-800`),
        solidDisabledColor: getCssVar(`palette-neutral-300`),
        solidDisabledBg: getCssVar(`palette-neutral-100`), //50

        // overrideTextPrimary: getCssVar(`palette-neutral-700`),
        // overrideTextSecondary: getCssVar(`palette-neutral-500`),
        // overrideTextTertiary: getCssVar(`palette-neutral-400`),
      },
      danger: {
        ...colors.red,
        ...createLightModeVariantVariables("danger"),
      },
      info: {
        ...colors.purple,
        ...createLightModeVariantVariables("info"),
      },
      success: {
        ...colors.green,
        ...createLightModeVariantVariables("success"),
      },
      warning: {
        ...colors.yellow,
        ...createLightModeVariantVariables("warning"),
        solidColor: getCssVar(`palette-common-black`),
        solidBg: getCssVar(`palette-warning-200`),
        solidHoverBg: getCssVar(`palette-warning-300`),
        solidActiveBg: getCssVar(`palette-warning-400`),
        solidDisabledColor: getCssVar(`palette-warning-200`),
        solidDisabledBg: getCssVar(`palette-warning-50`),

        softColor: getCssVar(`palette-common-black`),

        outlinedHoverBg: getCssVar(`palette-warning-50`),

        plainHoverBg: getCssVar(`palette-warning-50`),
      },
      common: {
        white: "#FFF",
        black: "#09090D",
      },
      text: {
        primary: getCssVar("palette-neutral-800"),
        secondary: getCssVar("palette-neutral-600"),
        tertiary: getCssVar("palette-neutral-500"),
      },
      background: {
        body: getCssVar("palette-common-white"),
        surface: getCssVar("palette-common-white"),
        level1: getCssVar("palette-neutral-50"),
        level2: getCssVar("palette-neutral-100"),
        level3: getCssVar("palette-neutral-200"),
        tooltip: getCssVar("palette-neutral-800"),
        backdrop: "rgba(255 255 255 / 0.5)",
      },
      divider: `rgba(${getCssVar("palette-neutral-mainChannel")} / 0.28)`,
      focusVisible: getCssVar("palette-primary-200"),
    },
    shadowRing: "0 0 #000",
    /**
     * TODO: ShadowChannel
     * 26, 26, 26
     */
    shadowChannel: "26, 26, 26", // "187 187 187",
  };
  const darkColorSystem = {
    palette: {
      mode: "dark",
      primary: {
        ...colors.blue,
        ...createDarkModeVariantVariables("primary"),
      },
      neutral: {
        ...colors.grey,
        plainColor: getCssVar(`palette-neutral-200`),
        plainHoverColor: getCssVar(`palette-neutral-50`),
        plainHoverBg: getCssVar(`palette-neutral-800`),
        plainActiveBg: getCssVar(`palette-neutral-700`),
        plainDisabledColor: getCssVar(`palette-neutral-700`),

        outlinedColor: getCssVar(`palette-neutral-200`),
        outlinedBorder: getCssVar(`palette-neutral-800`),
        outlinedHoverColor: getCssVar(`palette-neutral-50`),
        outlinedHoverBg: getCssVar(`palette-neutral-800`),
        outlinedHoverBorder: getCssVar(`palette-neutral-700`),
        outlinedActiveBg: getCssVar(`palette-neutral-800`),
        outlinedDisabledColor: getCssVar(`palette-neutral-800`),
        outlinedDisabledBorder: getCssVar(`palette-neutral-800`),

        softColor: getCssVar(`palette-neutral-200`),
        softBg: getCssVar(`palette-neutral-800`),
        softHoverColor: getCssVar(`palette-neutral-50`),
        softHoverBg: getCssVar(`palette-neutral-700`),
        softActiveBg: getCssVar(`palette-neutral-600`),
        softDisabledColor: getCssVar(`palette-neutral-700`),
        softDisabledBg: getCssVar(`palette-neutral-900`),

        solidColor: getCssVar(`palette-common-white`),
        solidBg: getCssVar(`palette-neutral-600`),
        solidHoverBg: getCssVar(`palette-neutral-700`),
        solidActiveBg: getCssVar(`palette-neutral-800`),
        solidDisabledColor: getCssVar(`palette-neutral-700`),
        solidDisabledBg: getCssVar(`palette-neutral-900`),

        // overrideTextPrimary: getCssVar(`palette-neutral-200`),
        // overrideTextSecondary: getCssVar(`palette-neutral-400`),
        // overrideTextTertiary: getCssVar(`palette-neutral-500`),
      },
      danger: {
        ...colors.red,
        ...createDarkModeVariantVariables("danger"),
      },
      info: {
        ...colors.purple,
        ...createDarkModeVariantVariables("info"),
      },
      success: {
        ...colors.green,
        ...createDarkModeVariantVariables("success"),
        solidColor: "#fff",
        solidBg: getCssVar(`palette-success-600`),
        solidHoverBg: getCssVar(`palette-success-700`),
        solidActiveBg: getCssVar(`palette-success-800`),
        solidDisabledColor: getCssVar(`palette-success-50`),
        solidDisabledBg: getCssVar(`palette-success-300`),
      },
      warning: {
        ...colors.yellow,
        ...createDarkModeVariantVariables("warning"),
        solidColor: getCssVar(`palette-common-black`),
        solidBg: getCssVar(`palette-warning-300`),
        solidHoverBg: getCssVar(`palette-warning-400`),
        solidActiveBg: getCssVar(`palette-warning-500`),
        solidDisabledColor: getCssVar(`palette-warning-50`),
        solidDisabledBg: getCssVar(`palette-warning-300`),
      },
      common: {
        white: "#FFF",
        black: "#09090D",
      },
      text: {
        primary: getCssVar("palette-neutral-100"),
        secondary: getCssVar("palette-neutral-300"),
        tertiary: getCssVar("palette-neutral-400"),
      },
      background: {
        body: getCssVar("palette-neutral-900"),
        surface: getCssVar("palette-common-black"),
        level1: getCssVar("palette-neutral-800"),
        level2: getCssVar("palette-neutral-700"),
        level3: getCssVar("palette-neutral-600"),
        tooltip: getCssVar("palette-neutral-600"),
        backdrop: `rgba(${getCssVar("palette-neutral-darkChannel")} / 0.5)`,
      },
      divider: `rgba(${getCssVar("palette-neutral-mainChannel")} / 0.24)`,
      focusVisible: getCssVar("palette-primary-500"),
    },
    shadowRing: "0 0 #000",
    shadowChannel: "0 0 0",
  };

  const defaultScales = {
    colorSchemes: {
      light: lightColorSystem,
      dark: darkColorSystem,
    },
    /**
     * TODO: FontSizes
     * 11 (0.6875rem)
     * 12 (0.75rem)
     * 14 (0.875rem)
     * 16 (1rem)
     * 20 (1.25rem)
     * 24 (1.5rem)
     * 32 (2rem)
     */
    fontSize: {
      xs: "0.6875rem", // 11px
      sm: "0.75rem", // 12px
      md: "0.875rem", // 14px
      lg: "1rem", // 16px  //using this in SvgIcon
      xl: "1.25rem", // 20px //using this in SvgIcon
      xl2: "1.5rem", // 24px  //using this in SvgIcon
      xl3: "2rem", // 32px

      // xs: "0.75rem",
      // sm: "0.875rem",
      // md: "1rem",
      // lg: "1.125rem",
      // xl: "1.25rem",
      // xl2: "1.5rem",
      // xl3: "1.875rem",
      // TODO: remove once all occurrence are removed from component
      xs3: "0.5rem",
      xs2: "0.625rem",
      xl4: "2.25rem",
      xl5: "3rem",
      xl6: "3.75rem",
      xl7: "4.5rem",
    },
    fontFamily: {
      body: `"Source Sans Pro", ${getCssVar("fontFamily-fallback")}`,
      display: `"Poppins", ${getCssVar("fontFamily-fallback")}`,
      code: "Source Code Pro,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
      fallback:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    /**
     * TODO: FontWeight
     * 400
     * 500
     * 600
     * 700
     */
    fontWeight: {
      sm: 400,
      md: 500,
      lg: 600,
      xl: 700,

      // sm: 300,
      // md: 500,
      // lg: 600,
      // xl: 700,
      // TODO: remove once all occurrence are removed form component
      xs: 200,
      xl2: 800,
      xl3: 900,
    },
    focus: {
      thickness: "2px",
      selector: `&.${generateUtilityClass(
        "",
        "focusVisible"
      )}, &:focus-visible`,
      default: {
        outlineOffset: `var(--focus-outline-offset, ${getCssVar(
          "focus-thickness"
        )})`,
        outline: `${getCssVar("focus-thickness")} solid ${getCssVar(
          "palette-focusVisible"
        )}`,
      },
    },
    lineHeight: {
      // sm: 1.25,
      // md: 1.5,
      // lg: 1.7,
      sm: "1rem",
      md: "1.25rem",
      lg: "1.5rem",
      xl: "2rem",
      xl2: "2.25rem",
      xl3: "3rem",
    },
    /**
     * TODO: LetterSpacing
     * normal | 0
     * 0.4px
     */
    letterSpacing: {
      sm: 0,
      md: "0.4px",
      // sm: "-0.01em",
      // md: "0.083em",
      // TODO: remove once all occurrence are removed form component
      lg: "0.125em",
    },
    radius: {
      xs: "4px",
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "20px",
    },
    /**
     * TODO: Shadows
     * sm: 0px 4px 8px rgba(26, 26, 26, 0.2)
     * md: 0px 12px 32px rgba(26, 26, 26, 0.24)
     * lg: 0px 24px 40px rgba(26, 26, 26, 0.16)
     */
    shadow: {
      sm: "0px 4px 8px rgba(26, 26, 26, 0.2)",
      md: "0px 12px 32px rgba(26, 26, 26, 0.24)",
      lg: "0px 24px 40px rgba(26, 26, 26, 0.16)",

      // TODO: remove once all occurrence are removed form component
      xs: `${getCssVar("shadowRing")}, 0 1px 2px 0 rgba(${getCssVar(
        "shadowChannel"
      )} / 0.12)`,

      xl: `${getCssVar("shadowRing")}, 0.3px 0.8px 1.1px rgba(${getCssVar(
        "shadowChannel"
      )} / 0.11), 1.8px 4.5px 6.4px -0.2px rgba(${getCssVar(
        "shadowChannel"
      )} / 0.13), 3.2px 7.9px 11.2px -0.4px rgba(${getCssVar(
        "shadowChannel"
      )} / 0.16), 4.8px 12px 17px -0.5px rgba(${getCssVar(
        "shadowChannel"
      )} / 0.19), 7px 17.5px 24.7px -0.7px rgba(${getCssVar(
        "shadowChannel"
      )} / 0.21), 10.2px 25.5px 36px -0.9px rgba(${getCssVar(
        "shadowChannel"
      )} / 0.24), 14.8px 36.8px 52.1px -1.1px rgba(${getCssVar(
        "shadowChannel"
      )} / 0.27), 21px 52.3px 74px -1.2px rgba(${getCssVar(
        "shadowChannel"
      )} / 0.29)`,
    },
    typography: {
      h1: {
        fontFamily: getCssVar("fontFamily-display"),
        fontWeight: getCssVar("fontWeight-xl"), //lg
        fontSize: getCssVar("fontSize-xl3"), //xl5
        lineHeight: getCssVar("lineHeight-xl3"), //sm
        letterSpacing: getCssVar("letterSpacing-sm"),
        color: getCssVar("palette-text-primary"),
      },
      h2: {
        fontFamily: getCssVar("fontFamily-display"),
        fontWeight: getCssVar("fontWeight-lg"),
        fontSize: getCssVar("fontSize-xl2"), //xl4
        lineHeight: getCssVar("lineHeight-xl2"), //sm
        letterSpacing: getCssVar("letterSpacing-sm"),
        color: getCssVar("palette-text-primary"),
      },
      h3: {
        fontFamily: getCssVar("fontFamily-body"),
        fontWeight: getCssVar("fontWeight-lg"), //md
        fontSize: getCssVar("fontSize-xl"), //xl3
        lineHeight: getCssVar("lineHeight-xl"), //sm
        color: getCssVar("palette-text-primary"),
      },
      h4: {
        fontFamily: getCssVar("fontFamily-body"),
        fontWeight: getCssVar("fontWeight-lg"), //md
        fontSize: getCssVar("fontSize-lg"), //xl2
        lineHeight: getCssVar("lineHeight-lg"), //md
        color: getCssVar("palette-text-primary"),
      },
      h5: {
        fontFamily: getCssVar("fontFamily-body"),
        fontWeight: getCssVar("fontWeight-md"),
        fontSize: getCssVar("fontSize-sm"), //xl
        lineHeight: getCssVar("lineHeight-md"),
        color: getCssVar("palette-text-primary"),
      },
      h6: {
        fontFamily: getCssVar("fontFamily-body"),
        fontWeight: getCssVar("fontWeight-md"),
        fontSize: getCssVar("fontSize-xs"), //lg
        lineHeight: getCssVar("lineHeight-sm"), //md
        color: getCssVar("palette-text-primary"),
      },
      body1: {
        fontFamily: getCssVar("fontFamily-body"),
        fontSize: getCssVar("fontSize-md"),
        lineHeight: getCssVar("lineHeight-md"),
        color: getCssVar("palette-text-primary"),
      },
      body2: {
        fontFamily: getCssVar("fontFamily-body"),
        fontSize: getCssVar("fontSize-sm"),
        lineHeight: getCssVar("lineHeight-md"),
        color: getCssVar("palette-text-secondary"),
      },
      subtitle1: {
        fontFamily: getCssVar("fontFamily-body"),
        fontSize: getCssVar("fontSize-xl"),
        lineHeight: getCssVar("lineHeight-xl"),
        color: getCssVar("palette-text-tertiary"),
      },
      subtitle2: {
        fontFamily: getCssVar("fontFamily-body"),
        fontSize: getCssVar("fontSize-lg"),
        lineHeight: getCssVar("lineHeight-lg"),
        color: getCssVar("palette-text-tertiary"),
      },
      // TODO: remove once all occurrence are removed form component

      display1: {
        fontFamily: getCssVar("fontFamily-display"),
        fontWeight: getCssVar("fontWeight-xl"),
        fontSize: getCssVar("fontSize-xl7"),
        lineHeight: getCssVar("lineHeight-sm"),
        letterSpacing: getCssVar("letterSpacing-sm"),
        color: getCssVar("palette-text-primary"),
      },
      display2: {
        fontFamily: getCssVar("fontFamily-display"),
        fontWeight: getCssVar("fontWeight-xl"),
        fontSize: getCssVar("fontSize-xl6"),
        lineHeight: getCssVar("lineHeight-sm"),
        letterSpacing: getCssVar("letterSpacing-sm"),
        color: getCssVar("palette-text-primary"),
      },
      body3: {
        fontFamily: getCssVar("fontFamily-body"),
        fontSize: getCssVar("fontSize-xs"),
        lineHeight: getCssVar("lineHeight-md"),
        color: getCssVar("palette-text-tertiary"),
      },
      body4: {
        fontFamily: getCssVar("fontFamily-body"),
        fontSize: getCssVar("fontSize-xs2"),
        lineHeight: getCssVar("lineHeight-md"),
        color: getCssVar("palette-text-tertiary"),
      },
      body5: {
        fontFamily: getCssVar("fontFamily-body"),
        fontSize: getCssVar("fontSize-xs3"),
        lineHeight: getCssVar("lineHeight-md"),
        color: getCssVar("palette-text-tertiary"),
      },
    },
  };

  const { colorSchemes, ...mergedScales } = scalesInput
    ? deepmerge(defaultScales, scalesInput)
    : defaultScales;

  const { palette: firstColorSchemePalette } =
    Object.entries(colorSchemes)[0][1];
  const variantInput = {
    palette: firstColorSchemePalette,
    cssVarPrefix,
    getCssVar,
  };

  const theme = {
    colorSchemes,
    ...mergedScales,
    breakpoints: createBreakpoints(breakpoints ?? {}),
    components: deepmerge(
      {
        // TODO: find a way to abstract SvgIcon out of @mui/material
        MuiSvgIcon: {
          defaultProps: {
            fontSize: "xl",
          },
          styleOverrides: {
            root: ({ ownerState, theme: themeProp }) => {
              const instanceFontSize = ownerState.instanceFontSize as
                | "inherit"
                | keyof FontSize;
              return {
                color: "var(--Icon-color)",
                margin: "var(--Icon-margin)",
                ...(ownerState.fontSize &&
                  ownerState.fontSize !== "inherit" && {
                    fontSize: `var(--Icon-fontSize, ${
                      themeProp.fontSize[ownerState.fontSize]
                    })`,
                  }),
                ...(ownerState.color &&
                  ownerState.color !== "inherit" &&
                  ownerState.color !== "context" &&
                  themeProp.vars.palette[ownerState.color!] && {
                    color: themeProp.vars.palette[ownerState.color].plainColor,
                  }),
                ...(ownerState.color === "context" && {
                  color: theme.variants.plain?.context?.color,
                }),
                ...(instanceFontSize &&
                  instanceFontSize !== "inherit" && {
                    "--Icon-fontSize":
                      themeProp.vars.fontSize[instanceFontSize],
                  }),
              };
            },
          },
        },
      } as Components<Theme>,
      componentsInput
    ),
    variants: deepmerge(
      {
        plain: createVariant("plain", variantInput),
        plainHover: createVariant("plainHover", variantInput),
        plainActive: createVariant("plainActive", variantInput),
        plainDisabled: createVariant("plainDisabled", variantInput),
        outlined: createVariant("outlined", variantInput),
        outlinedHover: createVariant("outlinedHover", variantInput),
        outlinedActive: createVariant("outlinedActive", variantInput),
        outlinedDisabled: createVariant("outlinedDisabled", variantInput),
        soft: createVariant("soft", variantInput),
        softHover: createVariant("softHover", variantInput),
        softActive: createVariant("softActive", variantInput),
        softDisabled: createVariant("softDisabled", variantInput),
        solid: createVariant("solid", variantInput),
        solidHover: createVariant("solidHover", variantInput),
        solidActive: createVariant("solidActive", variantInput),
        solidDisabled: createVariant("solidDisabled", variantInput),
        // variant overrides
        // plainOverrides: createTextOverrides(variantInput),
        // outlinedOverrides: createTextOverrides(variantInput),
        // softOverrides: createTextOverrides(variantInput),
        // solidOverrides: createContainedOverrides(variantInput),
      },
      variantsInput
    ),
    cssVarPrefix,
    getCssVar,
    spacing: createSpacing(spacing),
    colorInversionConfig: {
      soft: ["plain", "outlined", "soft", "solid"],
      solid: ["plain", "outlined", "soft", "solid"],
    },
  } as unknown as Theme; // Need type casting due to module augmentation inside the repo

  /**
   * Color channels generation
   */
  function attachColorChannels(
    palette: Record<ColorPaletteProp, PaletteRange>
  ) {
    (Object.keys(palette) as Array<ColorPaletteProp>).forEach((key) => {
      const channelMapping = {
        // Need type casting due to module augmentation inside the repo
        main: "500" as keyof PaletteRange,
        light: "200" as keyof PaletteRange,
        dark: "800" as keyof PaletteRange,
      };
      if (!palette[key].mainChannel && palette[key][channelMapping.main]) {
        palette[key].mainChannel = colorChannel(
          palette[key][channelMapping.main]
        );
      }
      if (!palette[key].lightChannel && palette[key][channelMapping.light]) {
        palette[key].lightChannel = colorChannel(
          palette[key][channelMapping.light]
        );
      }
      if (!palette[key].darkChannel && palette[key][channelMapping.dark]) {
        palette[key].darkChannel = colorChannel(
          palette[key][channelMapping.dark]
        );
      }
    });
  }

  (
    Object.entries(theme.colorSchemes) as Array<
      [string, { palette: Record<ColorPaletteProp, PaletteRange> }]
    >
  ).forEach(([, colorSystem]) => {
    attachColorChannels(colorSystem.palette);
  });

  return theme;
}
