import AppDataSource from "../data-source";
import { Request, Response } from "express";
import { User, Perfil, Department } from "../entities";
import { generateToken } from "../middlewares";

class UserController {
  public async login(req: Request, res: Response): Promise<Response> {
    const { mail, password } = req.body;

    const user: any = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .select()
      .addSelect("user.password")
      .where("user.mail=:mail", { mail })
      .getOne();

    if (user && user.iduser) {
      const r = await user.compare(password);
      if (r) {
        const token = await generateToken({
          id: user.iduser,
          perfil: user.perfil,
        });
        return res.json({ error: "mail or password incorrect" });
      } else {
        return res.json({ error: "user not found" });
      }
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    let { name, mail, password, profile, manager, departments } = req.body;
    if (!name || name.trim().length === 0) {
      return res.json({ error: "User name required" });
    }
    if (!mail || mail.trim().length === 0) {
      return res.json({ error: "User mail required" });
    }
    if (!password || password.trim().length === 0) {
      return res.json({ error: "User password required" });
    }
    if (!departments || departments[0].trim().length === 0) {
      return res.json({ error: "User department(s) id(s) required" });
    }

    const object = new User();
    object.name = name.trim();
    object.mail = mail.trim();
    object.password = password.trim();
    object.profile = !profile ? "employee" : profile;

    if (departments) {
      const department = await AppDataSource.manager.findOneBy(Department, {
        iddepartment: departments[0],
      });
      if (!department || !department.iddepartment) {
        return res.json({ error: "Invalid department" });
      }
      object.departments[0] = department;
    }

    if (manager) {
      const idmanager = await AppDataSource.manager.findOneBy(User, {
        iduser: manager,
      });
      if (!idmanager || !idmanager.iduser) {
        return res.json({ error: "Manager not found" });
      }
      if (idmanager.profile !== "manager") {
        return res.json({ error: "User provided is not a manager" });
      }
      object.manager = manager;
    }

    const response: any = await AppDataSource.manager
      .save(User, object)
      .catch((e) => {
        if (/(mail)[\s\S]+(already exists)/.test(e.detail)) {
          return { error: "This mail already exists" };
        }
        return { error: e.message };
      });

    return res.json(response);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { iduser } = req.body;
    if (!iduser || iduser.trim() === "") {
      return res.json({ error: "User id required" });
    }
    const object: any = await AppDataSource.manager.findOneBy(User, { iduser });
    if (object && object.iduser) {
      const r = await AppDataSource.manager
        .remove(User, object)
        .catch((e) => e.message);
      return res.json(r);
    } else {
      return res.json({ error: "User not found" });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { iduser, name, mail, profile, manager, departments } = req.body;
    if (!iduser || iduser.trim() === "") {
      return res.json({ error: "User id required" });
    }
    const object: any = await AppDataSource.manager.findOneBy(User, { iduser });
    if (object && object.iduser) {
      object.name = !name || name.trim() === "" ? object.name : name.trim();
      object.mail = !mail || mail.trim() === "" ? object.mail : mail.trim();
      object.profile =
        !profile || profile.trim() === "" ? object.profile : profile.trim();

      if (manager === iduser) {
        return res.json({ error: "User can't be the itself manager" });
      }
      if (manager) {
        const idmanager = await AppDataSource.manager.findOneBy(User, {
          iduser: manager,
        });
        if (!idmanager || !idmanager.iduser) {
          return res.json({ error: "Manager not found" });
        }
        if (idmanager.profile !== "manager") {
          return res.json({ error: "User provided is not a manager" });
        }
        object.manager = idmanager;
      }
      if (departments) {
        const department = await AppDataSource.manager.findOneBy(Department, {
          iddepartment: departments[0],
        });
        if (!department || !department.iddepartment) {
          return res.json({ error: "Invalid department" });
        }
        object.departments[0] = department;
      }

      const user = await AppDataSource.manager.save(User, object).catch((e) => {
        if (/(mail)[\s\S]+(already exists)/.test(e.detail)) {
          return { error: "Mail already exists" };
        }
        return e.message;
      });
      return res.json(user);
    } else {
      res.json({ error: "User not found" });
    }
  }

  public async updatePassword(req: Request, res: Response): Promise<Response> {
    const { password } = req.body;
    const { id } = res.locals;
    if (!password || password.trim().length == 0) {
      return res.json({ error: "Inform the new password" });
    }
    const object: any = await AppDataSource.manager.findOneBy(User, {
      iduser: id,
    });
    if (object && object.iduser) {
      object.password = password.trim();
      const user = await AppDataSource.manager.save(User, object);
      return res.json(user);
    } else {
      return res.json({ error: "User not found" });
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const { profile } = req.params;
    const _profile = profile as Perfil;
    const object: any = await AppDataSource.getRepository(User).find({
      where: {
        profile: _profile,
      },
      relations: {
        departments: true,
      },
      order: {
        name: "asc",
      },
    });
    return res.json(object);
  }
}

export default new UserController();
