import { Request, Response } from 'express';
import { AppDataSource } from '../db';
import { User } from '../entity/User';

const userRepository = AppDataSource.getRepository(User);

const handleErrors = (err: unknown, res: Response, message: string) => {
    if (err instanceof Error) {
        console.error(message, err.message);
        res.status(500).send("Server error");
    } else {
        console.error("Неизвестная ошибка:", err);
        res.status(500).send("Server error");
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find();
        res.json(users);
    } catch (err) {
        handleErrors(err, res, "Ошибка выполнения запроса SELECT:");
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!user) {
            return res.status(404).send("Пользователь не найден");
        }
        res.json(user);
    } catch (err) {
        handleErrors(err, res, "Ошибка выполнения запроса SELECT:");
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, age, email } = req.body;
    if (!name || !email || !age) {
        return res.status(400).send("Необходимо указать имя, возраст и email");
    }
    try {
        const user = userRepository.create({ name, age, email });
        const result = await userRepository.save(user);
        res.status(201).json(result);
    } catch (err) {
        handleErrors(err, res, "Ошибка выполнения запроса INSERT:");
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { name, age, email } = req.body;
    try {
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!user) {
            return res.status(404).send("Пользователь не найден");
        }
        user.name = name;
        user.age = age;
        user.email = email;
        const result = await userRepository.save(user);
        res.status(200).json(result);
    } catch (err) {
        handleErrors(err, res, "Ошибка выполнения запроса UPDATE:");
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userRepository.delete({ id: parseInt(req.params.id) });
        if (result.affected === 0) {
            return res.status(404).send("Пользователь не найден");
        }
        res.json({ message: "Пользователь успешно удален" });
    } catch (err) {
        handleErrors(err, res, "Ошибка выполнения запроса DELETE:");
    }
};
