import type { Response, Request } from "express";
import { prisma } from "../../db";
import { responseSuccess, responseError } from "../../network/responses";
import { handleResponseError } from "../../utils";


export async function list(req: Request, res: Response): Promise<Response> {
    try {
        const offers = await prisma.offer.findMany();
        return responseSuccess({ res, data: offers, status: 203 });
    } catch (error) {
        return handleResponseError(res, error);
    }
}


export async function getById(req: Request, res: Response): Promise<Response> {
    try {
        const offer = await prisma.offer.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!offer) {
            return responseError({ res, data: "oferta no encontrada" });
        }

        return responseSuccess({ res, data: offer });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function create(req: Request, res: Response): Promise<Response> {
    try {
        const offer = await prisma.offer.create({
            data: req.body,
        });

        if (offer) {
            return responseError({ res, data: "oferta ya existente" });
        }

        return responseSuccess({ res, data: "oferta creada" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function update(req: Request, res: Response): Promise<Response> {
    try {
        const offer = await prisma.offer.update({
            where: {
                id: Number(req.params.id),
            },
            data: req.body,
        });

        if (!offer) {
            return responseError({ res, data: "oferta no encontrada" });
        }

        return responseSuccess({ res, data: "oferta actualizada" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}

export async function destroy(req: Request, res: Response): Promise<Response> {
    try {
        await prisma.offer.delete({
            where: {
                id: Number(req.params.id),
            },
        });

        return responseSuccess({ res, data: "oferta eliminada" });
    } catch (error) {
        return handleResponseError(res, error);
    }
}