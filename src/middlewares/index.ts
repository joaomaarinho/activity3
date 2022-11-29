import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const generateToken = async (user) =>
  jwt.sign(user, process.env.JWT_SECRET);

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = <{ iduser: string; profile: string }>(
      jwt.verify(token, process.env.JWT_SECRET)
    );
    if (!decoded || !decoded.iduser) {
      res.status(401).send({ error: "Invalid Authorization Token" });
    } else {
      res.locals = { id: decoded.iduser, perfil: decoded.profile };
    }
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }
  return next();
};

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { profile } = res.locals;
  if (profile !== "admin") {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }
  return next();
};

export const authGestor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { profile } = res.locals;
  if (profile !== "manager") {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }
  return next();
};
