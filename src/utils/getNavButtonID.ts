import { generateRandomString } from "@/utils/generateRandomString";

export const getNavButtonID = (prefix: string, direction: "prev" | "next") => {
  return `${prefix}-slider-nav-${direction}_${generateRandomString(5)}`;
};
