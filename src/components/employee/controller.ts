import dotenv from "dotenv";
import type { Response, Request } from "express";
import { prisma } from "../../db";
import { responseSuccess, responseError } from "../../network/responses";
import { handleResponseError } from "../../utils";
import { hash } from "../../crypto";

dotenv.config();


export async function list(req: Request, res: Response): Promise<Response> {
    try {
        const employees = await prisma.employee.findMany();
        return responseSuccess({ res, data: employees, status: 203 });
    } catch (error) {
        return handleResponseError(res, error);
    }
}


export async function getById(req: Request, res: Response): Promise<Response> {
    try {
        const employee = await prisma.employee.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!employee) {
            return responseError({ res, data: "empleado no encontrado" });
        }

        return responseSuccess({ res, data: employee });
    } catch (error) {
        return handleResponseError(res, error);
    }
}


export async function update(req: Request, res: Response): Promise<Response> {
    try {
        const employee = await prisma.employee.update({
            where: {
                id: Number(req.params.id),
            },
            data: req.body,
        });

        if (!employee) {
            return responseError({ res, data: "empleado no encontrado" });
        }

        return responseSuccess({ res, data: "perfil de empleado actualizado" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
    try {
        await prisma.employee.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        return responseSuccess({ res, data: "perfil de empleado eliminado" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}


export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const employee = await prisma.employee.findUnique({
            where: {
                email: email,
            },
        });

        if (!employee) {
            return responseError({
                res,
                data: "Empleado inexistente",
                status: 401,
            });
        }

        const hashedInputPassword = hash(password);
        //const rootEmail = process.env.SU_EMAIL;
        const rootEmail = "root@bigotes.net"
        //const hashedRootPassword = hash(process.env.SU_PASSWORD);
        const rootPassword = "bigotes123"
        //root access
        if (email === rootEmail && password === rootPassword) {
            return responseSuccess({
                res,
                data: "Usted se ha logeado como root",
            })
        }
        if (employee.password !== hashedInputPassword) {
            return responseError({
                res,
                data: "Correo o contraseña incorrectos",
                status: 401,
            });
        }

        return responseSuccess({
            res,
            data: "El perfil de empleado se ha verificado",
        });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

// GET by email

export async function checkIfAvailableEmail(req: Request, res: Response): Promise<Response> {
    try {
        const { email } = req.body;

        if (!email) {
            return responseError({
                res,
                data: "El correo no ha sido provisto",
                status: 400,
            });
        }

        const employee = await prisma.employee.findUnique({
            where: {
                email: email,
            },
        });

        if (employee) {
            return responseSuccess({ res, data: "Perfil de empleado existente", status: 200 });
        }

        return responseError({
            res,
            data: "Perfil de empleado no encontrado",
            status: 400,
        });
    } catch (error) {
        return handleResponseError(res, error);
    }
}


export async function signup(req: Request, res: Response): Promise<Response> {
    try {
        const { name, lastname, email, password, rootValidation } = req.body;
        const hashedPassword = hash(password);
        //const hashedValidationPassword = hash(rootValidation);
        //const hashedRootPassword = hash(process.env.SU_PASSWORD);

        if (rootValidation === "bigotes123") {
            await prisma.employee.create({
                data: {
                    name,
                    lastname,
                    email,
                    password: hashedPassword,
                },
            });

            return responseSuccess({
                res,
                data: "Perfil de empleado ha sido creado",
                status: 201,
            });
        }

        return responseError({
            res,
            data: "No se ha podido validar su solicitud",
        })
    } catch (error) {
        if (error) {
            // Unique constraint failed
            if (error === "P2002") {
                return responseError({
                    res,
                    data: "No se puede crear un correo con estas características (correo existente)",
                    status: 400,
                });
            }
        }
        return responseError({ res, data: error });
    }
}

export async function getByEmail(req: Request, res: Response): Promise<Response> {
    try {
        const { email } = req.body;
        const employee = await prisma.employee.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        if (!employee) {
            return responseError({ res, data: "Perfil de empleado no encontrado" });
        }

        return responseSuccess({ res, data: employee });
    } catch (error) {
        return handleResponseError(res, error);
    }
}