import { generateRandomString } from "@/utils/generateRandomString";

export const getPaginationID = () => {
  return `years-slider-pagination_${generateRandomString(5)}`;
}