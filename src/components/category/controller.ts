import type { Response, Request } from "express";
import { prisma } from "../../db";
import { responseSuccess, responseError } from "../../network/responses";
import { handleResponseError } from "../../utils";


export async function list(req: Request, res: Response): Promise<Response> {
    try {
        const categories = await prisma.category.findMany();
        return responseSuccess({ res, data: categories, status: 203 });
    } catch (error) {
        return handleResponseError(res, error);
    }
}


export async function getById(req: Request, res: Response): Promise<Response> {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!category) {
            return responseError({ res, data: "categoría no encontrada" });
        }

        return responseSuccess({ res, data: category });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function create(req: Request, res: Response): Promise<Response> {
    try {
        const newCategory = req.body;

        const verifyCategory = await prisma.category.findUnique({
            where: {
                name: req.params.name,
            },
        });
        console.log(verifyCategory)

        if (!verifyCategory) {
            await prisma.category.create({ data: req.body, });

        return responseSuccess({ res, data: "Categoría creada" });
        }
        return responseError({ res, data: "Categoría ya existente" });

    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function update(req: Request, res: Response): Promise<Response> {
    try {
        const category = await prisma.category.update({
            where: {
                id: Number(req.params.id),
            },
            data: req.body,
        });

        if (!category) {
            return responseError({ res, data: "categoría no encontrada" });
        }

        return responseSuccess({ res, data: "categoría actualizada" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
    try {
        await prisma.category.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        return responseSuccess({ res, data: "categoría eliminada" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}