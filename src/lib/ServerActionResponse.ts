import { StatusCodes, isError } from "./StatusCodes";

type ServerActionResponse = {
  status: number;
  message?: string;
  data?: any;
};

export const ServerActionResponse = (props: ServerActionResponse) => {
  return {
    status: props.status,
    code: StatusCodes[props.status],
    data: props?.data,
    message: props?.message || "Something went wrong...",
    error: isError(props.status) ? props.data : null,
  };
};

export const InternalServerErrorResponse = (error: any) => {
  return ServerActionResponse({
    status: error?.status ? error.status : StatusCodes.InternalServerError,
    message: error?.message ? error.message : "Internal server error",
    data: null,
  });
};
