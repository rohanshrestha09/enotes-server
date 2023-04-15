import { Request, Response, NextFunction } from "express";

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

function errorMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;

  const message = err.message || "Something went wrong";

  res.status(status).json({
    status,
    message,
  });
}

export { HttpException, errorMiddleware };
