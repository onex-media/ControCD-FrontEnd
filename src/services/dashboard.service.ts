import { doGet } from "./requestHandler";
import { counterResponseSchema } from "src/schemas/dashboard.schema";

export const counterEntities = async () => {
  try {
    const response = (await doGet<any>(
      "dashboard/counter-entities",
      counterResponseSchema.parse
    )) as any;
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
