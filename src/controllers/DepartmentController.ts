import AppDataSource from "../data-source";
import { Request, Response } from "express";
import { Department, User, Status } from "../entities";

class DepartmentController {
  public async create(req: Request, res: Response): Promise<Response> {
    let { name, status, users } = req.body;
    if (!name || name.trim().length == 0) {
      return res.json({ error: "Informe the department name" });
    }

    const object = new Department();
    object.name = name.trim();
    if (status) {
      object.status = status.trim();
    }
    if (users && users.trim().split(",").length > 0) {
      const lista = users.trim().split(",");
      const objectColaboradores = [];
      for (let i = 0, user: any; i < lista.length; i++) {
        user = await AppDataSource.manager.findOneBy(User, {
          iduser: lista[i],
        });
        if (user && user.idcolaborador) {
          objectColaboradores.push(user);
        }
      }
      object.users = objectColaboradores;
    }

    const department: any = await AppDataSource.manager
      .save(Department, object)
      .catch((e) => {
        if (/(name)[\s\S]+(already exists)/.test(e.detail)) {
          return { error: "Department name already registered" };
        }
        return e.message;
      });
    return res.json(department);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { iddepartment } = req.body;
    if (!iddepartment || iddepartment.trim() === "") {
      return res.json({ error: "Inform the department id" });
    }
    const object: any = await AppDataSource.manager.findOneBy(Department, {
      iddepartment,
    });
    if (object && object.iddepartment) {
      const r = await AppDataSource.manager
        .remove(Department, object)
        .catch((e) => e.message);
      return res.json(r);
    } else {
      return res.json({ error: "Department not found" });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    let { iddepartment, name, status, users } = req.body;
    if (!iddepartment || iddepartment.trim() === "") {
      return res.json({ error: "Inform the department id" });
    }
    const object: any = await AppDataSource.manager.findOneBy(Department, {
      iddepartment,
    });
    if (object && object.iddepartment) {
      object.name = !name || name.trim() === "" ? object.name : name.trim();
      object.status =
        !status || status.trim() === "" ? object.status : status.trim();

      if (users && users.trim().split(",").length > 0) {
        const lista = users.trim().split(",");
        const objectColaboradores = [];
        for (let i = 0, user: any; i < lista.length; i++) {
          user = await AppDataSource.manager.findOneBy(User, {
            iduser: lista[i],
          });
          if (user && user.iduser) {
            objectColaboradores.push(user);
          }
        }
        object.user = objectColaboradores;
      }

      const department = await AppDataSource.manager
        .save(Department, object)
        .catch((e) => {
          if (/(name)[\s\S]+(already exists)/.test(e.detail)) {
            return { error: "Department name already exists" };
          }
          return e.message;
        });
      return res.json(department);
    } else {
      return res.json({ error: "Department not found" });
    }
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const { status } = req.params;
    const _status = status as Status;
    const object: any = await AppDataSource.getRepository(Department).find({
      where: {
        status: _status,
      },
      relations: {
        users: true,
      },
      order: {
        name: "asc",
      },
    });
    return res.json(object);
  }
}

export default new DepartmentController();
