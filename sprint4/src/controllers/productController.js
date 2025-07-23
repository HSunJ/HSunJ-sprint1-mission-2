import { PrismaClient } from "@prisma/client";
import { PatchProduct } from '../structs.js';
import { assert } from "superstruct";

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
    const { offset = 0, limit = 10, order = "recent", keyword = "" } = req.query;
    const orderBy = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            createdAt: true
        },
        where: {
            OR: [
                { name: { contains: keyword, mode: 'insensitive' } },
                { description: { contains: keyword, mode: 'insensitive' } }
            ]
        },
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
    });
    res.status(200).send(products);
};

export const getProduct = async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            createdAt: true
        },
        where: { id },
    });
    res.status(200).send(product);
};

export const createProduct = async (req, res) => {
    const product = await prisma.product.create({
        data: {
            ...req.body,
            userId: req.user.userId,
        },
    });
    res.status(201).send(product);
};

export const patchProduct = async (req, res) => {
    assert(req.body, PatchProduct);
    const { id } = req.params;
    const product = await prisma.product.update({
        where: { id },
        data: {
            ...req.body,
            userId: req.user.userId,
        }
    });
    res.status(202).send(product);
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
        where: { id },
    });
    res.sendStatus(204);
};