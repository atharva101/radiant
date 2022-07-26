import { generateUtilityClass, generateUtilityClasses } from "../className";

export interface MenuClasses {
  /** Classname applied to the root element. */
  root: string;
  /** Classname applied to the root element when the menu open. */
  expanded: string;
  /** Classname applied to the root element if `color="primary"`. */
  colorPrimary: string;
  /** Classname applied to the root element if `color="neutral"`. */
  colorNeutral: string;
  /** Classname applied to the root element if `color="danger"`. */
  colorDanger: string;
  /** Classname applied to the root element if `color="info"`. */
  colorInfo: string;
  /** Classname applied to the root element if `color="success"`. */
  colorSuccess: string;
  /** Classname applied to the root element if `color="warning"`. */
  colorWarning: string;
  /** Classname applied to the root element if `variant="plain"`. */
  variantPlain: string;
  /** Classname applied to the root element if `variant="outlined"`. */
  variantOutlined: string;
  /** Classname applied to the root element if `variant="soft"`. */
  variantSoft: string;
  /** Classname applied to the root element if `variant="solid"`. */
  variantSolid: string;
  /** Classname applied to the root element if `size="sm"`. */
  sizeSm: string;
  /** Classname applied to the root element if `size="md"`. */
  sizeMd: string;
  /** Classname applied to the root element if `size="lg"`. */
  sizeLg: string;
}

export type MenuClassKey = keyof MenuClasses;

export function getMenuUtilityClass(slot: string): string {
  return generateUtilityClass("RadMenu", slot);
}

const menuClasses: MenuClasses = generateUtilityClasses("RadMenu", [
  "root",
  "expanded",
  "colorPrimary",
  "colorNeutral",
  "colorDanger",
  "colorInfo",
  "colorSuccess",
  "colorWarning",
  "variantPlain",
  "variantOutlined",
  "variantSoft",
  "variantSolid",
  "sizeSm",
  "sizeMd",
  "sizeLg",
]);

export default menuClasses;
