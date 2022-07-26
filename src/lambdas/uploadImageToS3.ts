import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";
import middy from "middy";
import { doNotWaitForEmptyEventLoop, jsonBodyParser } from "middy/middlewares";
import { APIGatewayEvent, DefaultResponse } from "../types/aws";
import { APIGatewayResponse } from "../utils/aws";
import { apiGatewayResponse } from "../middlewares/apiGatewayResponse";
import { S3UploadRequest, S3UploadResponse } from "../types/responses";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import Boom from "@hapi/boom";

const imagesBucket = process.env.IMAGE_BUCKET!;

const rawHandler = async (
  event: APIGatewayEvent<S3UploadRequest>
): Promise<APIGatewayResponse<S3UploadResponse>> => {
  const { image } = event.body;

  const s3 = new S3();

  const imageKey = `${uuid()}.jpg`;

  const params: PutObjectRequest = {
    Body: Buffer.from(image, "base64"),
    Bucket: imagesBucket,
    Key: imageKey,
    ACL: "public-read",
  };

  try {
    await s3.putObject(params).promise();
  } catch (e) {
    console.log(e);
    throw Boom.badRequest("Image was corrupted");
  }

  const imageUrl = `https://${imagesBucket}.s3.amazonaws.com/${imageKey}`;

  return { imageUrl };
};

export const handler = middy(rawHandler)
  .use(jsonBodyParser())
  .use(doNotWaitForEmptyEventLoop())
  .use(
    apiGatewayResponse<
      APIGatewayEvent<S3UploadRequest>,
      APIGatewayResponse<S3UploadResponse>
    >()
  );
