import type { Request, Response } from "express";

const index = (req: Request, res: Response) => {
  res.json({
    message: "Hello world.",
  });
};

export default index;
