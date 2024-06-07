type InvalidParam = {
  name: string;
  reason: string;
};

type SuccessResponse = {
  status: number;
  message: string;
};

type ProblemDetailErrorResponse = {
  type: string;
  title: string;
  status: number;
  detail: string;
  invalidParams?: InvalidParam;
};

export const successResponse = (status: number, message: string) => {
  const response: SuccessResponse = {
    status,
    message,
  };
  return response;
};

export const errorResponse = (
  type: string = "about:blank",
  title: string,
  status: number,
  detail: string,
  invalidParams?: InvalidParam
) => {
  const problemDetailType =
    type === "" || type === undefined ? "about:blank" : type;
  const response: ProblemDetailErrorResponse = {
    type: problemDetailType,
    title,
    status,
    detail,
    invalidParams,
  };
  return response;
};
