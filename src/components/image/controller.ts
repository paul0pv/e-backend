import { prisma } from "../../db";
import { Request, Response } from "express";
import { responseError, responseSuccess } from "../../network/responses";
import { handleResponseError } from "../../utils/index";

export async function list(req: Request, res: Response): Promise<Response> {
    try {
        const images = await prisma.image.findMany();
        return responseSuccess({ res, data: images, status: 203 });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function getbyProduct(req: Request, res: Response) {
    try {
        const product = await prisma.image.findMany({
            where: {
                productId: Number(req.params.productId),
            },
        });

        if (!product) {
            return responseError({ res, data: "No hay imagen asignada a este producto" });
        }

        responseSuccess({ res, data: product });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function store(req: Request, res: Response): Promise<Response> {
    try {
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: req.body.productId,
            },
        });

        if (!existingProduct) {
            return responseError({ res, data: "Producto no encontrado" });
        }

        await prisma.image.create({
            data: req.body,
        });

        return responseSuccess({ res, data: "Imagen asignada al producto", status: 201 });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function update(req: Request, res: Response): Promise<Response> {
    try {

        const existingImage = await prisma.image.findFirst({
            where: {
                id: req.body.id,
                productId: req.body.productId,
            },
        });

        if (!existingImage) {
            return responseError({ res, data: "Imagen no encontrada" });
        }

        const updatedImage = await prisma.image.update({
            where: {
                id: existingImage.id,
            },
            data: req.body,
        });

        return responseSuccess({ res, data: "Imagen actualizada" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
    try {
        const existingProduct = await prisma.image.findFirst({
            where: {
                productId: Number(req.params.productId),
            },
        });

        if (!existingProduct) {
            return responseError({ res, data: "Imagen no encontrada" });
        }

        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.productId),
            },
        });
        return responseSuccess({ res, data: "La imagen ha sido eliminada exitosamente" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}
