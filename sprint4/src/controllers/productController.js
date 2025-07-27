import { PrismaClient } from "@prisma/client";
import { PatchProduct } from '../structs.js';
import { assert } from "superstruct";

import productRepository from "../repositories/productRepository.js";
import userRepository from "../repositories/userRepository.js";

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
    const { offset = 0, limit = 10, order = "recent", keyword = "" } = req.query;
    const orderBy = order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' };
    const userId = req.user?.userId;
    console.log(userId);

    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            createdAt: true,
            likedUser: userId ? { where: { id: userId } } : false
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

    const productList = products.map((product) => {
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            createdAt: product.createdAt,
            isLiked: product.likedUser?.length > 0 ? true : false
        }
    });
    res.status(200).send(productList);
};

export const getProduct = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    const product = await prisma.product.findUniqueOrThrow({
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            tags: true,
            likedUser: userId ? {
                where: { id: userId },
                select: { id: true }
            } : false,
            createdAt: true
        },
        where: { id },
    });

    product.isLiked = false;
    if (product.likedUser?.length > 0) {
        product.isLiked = true;
    }
    const { likedUser, ...productData } = product;

    res.status(200).send(productData);
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

export const likeProduct = async (req, res) => {
    const userId = req.user.userId;
    const id = req.params.id;
    const product = await prisma.product.findUnique({
        where: {
            id
        },
        select: {
            likedUser: {
                where: { id: userId },
                select: { id: true }
            }
        }
    })

    if (!product) {
        const error = new Error("상품이 존재하지 않습니다");
        error.status = 404;
        throw error;
    }

    if (product.likedUser.length > 0) {
        // 좋아요 해제
        await prisma.product.update({
            where: { id },
            data: {
                likedUser: { disconnect: { id: userId } }
            }
        });
        res.status(201).json({ message: "좋아요가 취소되었습니다." });
    }
    else {
        await prisma.product.update({
            where: { id },
            data: { likedUser: { connect: { id: userId } } }
        });
        res.status(201).json({ message: "좋아요를 눌렀습니다" });
    }
}