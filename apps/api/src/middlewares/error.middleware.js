export const globalErrHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isProd = process.env.NODE_ENV === "production";

  const { message, statusCode } = error.message;
  const status = error.statusCode > 500 ? "error" : "fail";

  const responseBody = {
    status,
    error: {
      message,
    },
  };

  if (!isProd && error instanceof Error && error.stack) {
    responseBody.error.stack = error.stack;
  }

  res.status(statusCode).json(responseBody);
};
