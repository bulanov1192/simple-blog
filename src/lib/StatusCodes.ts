export enum StatusCodes {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  MovedPermanently = 301,
  Found = 302,
  NotFound = 404,
  Unauthorized = 401,
  Forbidden = 403,
  InternalServerError = 500,
  BadRequest = 400,
  Conflict = 409,
  UnprocessableEntity = 422,
  NotImplemented = 501,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export const isError = (statusCode: number) => {
  return statusCode >= 400;
};
