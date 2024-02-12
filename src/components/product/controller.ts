import type { Response, Request } from "express";
import { prisma } from "../../db";
import { responseSuccess, responseError } from "../../network/responses";
import { handleResponseError } from "../../utils";
import { mapInsertProduct } from "./utils";
import { IBody } from "../../core/types";


export async function list(req: Request, res: Response): Promise<Response> {
    try {
        const products = await prisma.product.findMany();

        return responseSuccess({ res, data: products, status: 203 });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function getById(req: Request, res: Response): Promise<Response> {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!product) {
            return responseError({ res, data: "Producto no encontrado" });
        }

        return responseSuccess({ res, data: product });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function store(req: Request, res: Response): Promise<Response> {
    try {
        const { ok, data } = mapInsertProduct(req.body as IBody);

        await prisma.product.create({ data });
        return responseSuccess({ res, data: "Producto creado", status: 201 });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function update(req: Request, res: Response): Promise<Response> {
    try {
        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id),
            },
            data: req.body,
        });

        if (!product) {
            return responseError({ res, data: "Producto no encontrado" });
        }

        return responseSuccess({ res, data: "Producto actualizado" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
    try {
        const id = Number(req.params.id);

        const image = await prisma.image.findFirst({
            where: {
                productId: id,
            },
        });

        const offer = await prisma.offer.findFirst({
            where: {
                productId: id,
            },
        });

        if (image || offer) {
            return responseError({ res, data: "El producto tiene imagen/oferta existentes" });
        }

        await prisma.product.delete({
            where: {
                id: id,
            },
        });

        return responseSuccess({ res, data: "El producto ha sido eliminado" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function validateImage(req: Request, res: Response): Promise<Response> {
    try {
        const image = await prisma.image.findMany();

        if (image.length > 0) {
            return responseSuccess({ res, data: "No hay registros de imágenes" });
        } else {
            return responseError({ res, data: "Existen registros de imágenes" });
        }
    } catch (error) {
        return handleResponseError(res, error);
    } finally {
        await prisma.$disconnect();
    }
}
