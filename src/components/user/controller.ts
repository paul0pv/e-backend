import dotenv from "dotenv";
import type { Response, Request } from "express";
import { prisma } from "../../db";
import { responseSuccess, responseError } from "../../network/responses";
import { handleResponseError } from "../../utils";
import { hash } from "../../crypto";

dotenv.config();

export async function list(req: Request, res: Response): Promise<Response> {
    try {
        const users = await prisma.user.findMany();
        return responseSuccess({ res, data: users, status: 203 });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function getById(req: Request, res: Response): Promise<Response> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!user) {
            return responseError({ res, data: "Usuario no encontrado" });
        }
        return responseSuccess({ res, data: user });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function update(req: Request, res: Response): Promise<Response> {
    try {
        if (req.body.password) {
            req.body.password = hash(req.body.password);
        }

        const user = await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: req.body,
        });

        if (!user) {
            return responseError({ res, data: "Usuario no encontrado" });
        }

        return responseSuccess({ res, data: "Información de usuario actualizada" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
    try {
        await prisma.user.delete({ where: { id: Number(req.params.id) } });

        return responseSuccess({ res, data: "Usuario eliminado" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function login(req: Request, res: Response): Promise<Response> {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return responseError({
                res,
                data: "Correo o contraseña inválidos",
                status: 401,
            });
        }


        const hashedInputPassword = hash(password);
        if (user.password !== hashedInputPassword) {
            return responseError({
                res,
                data: "Correo o contraseña inválidos",
                status: 401,
            });
        }


        return responseSuccess({
            res,
            data: "Se ha autenticado este acceso",
        });
    } catch (error) {
        return handleResponseError(res, error);
    }
}


export async function checkIfAvailableEmail(req: Request, res: Response): Promise<Response> {
    try {
        const { email } = req.body;

        if (!email) {
            return responseError({
                res,
                data: "El correo no ha sido provisto",
                status: 401,
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });


        if (user) {
            return responseSuccess({ res, data: "Existe un perfil con este usuario", status: 200 });
        }

        return responseError({
            res,
            data: "Perfil de usuario no encontrado",
            status: 400,
        });
    } catch (error) {
        return responseError({ res, data: error });
    }
}



export async function signUp(req: Request, res: Response): Promise<Response> {
    try {
        const { name, lastname, email, password } = req.body;
        const hashedPassword = hash(password);


        await prisma.user.create({
            data: {
                name,
                lastname,
                email,
                password: hashedPassword,
                phoneNumber: "",
                address: "",
                city: "",
                region: "",
                country: "",
                cardNumber: "",
            },
        });

        return responseSuccess({
            res,
            data: "Usuario creado",
            status: 201,
        });
    } catch (error) {
        if (error) {

            if (error === "P2002") {
                return responseError({
                    res,
                    data: "No se puede crear una cuenta, este correo está en uso",
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
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phoneNumber: true,
                address: true,
                city: true,
                region: true,
                country: true,
                cardNumber: true,
            },
        });

        if (!user) {
            return responseError({ res, data: "Perfil de usuario no encontrado" });
        }

        return responseSuccess({ res, data: user });
    } catch (error) {
        return responseError({ res, data: error });
    }
}

