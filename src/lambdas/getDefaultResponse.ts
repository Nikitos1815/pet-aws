import middy from "middy";
import { doNotWaitForEmptyEventLoop, jsonBodyParser } from "middy/middlewares";
import { APIGatewayEvent, DefaultResponse } from "../types/aws";
import { APIGatewayResponse } from "../utils/aws";
import { apiGatewayResponse } from "../middlewares/apiGatewayResponse";

const rawHandler = async (
  event: APIGatewayEvent<null>
): Promise<APIGatewayResponse<DefaultResponse>> => {
  return { success: true };
};

export const handler = middy(rawHandler)
  .use(jsonBodyParser())
  .use(doNotWaitForEmptyEventLoop())
  .use(
    apiGatewayResponse<
      APIGatewayEvent<null>,
      APIGatewayResponse<DefaultResponse>
    >()
  );
