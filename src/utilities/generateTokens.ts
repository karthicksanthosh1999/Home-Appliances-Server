import jwt from 'jsonwebtoken';

export const generateVerificationToken = (userId: object | string) => {
    return jwt.sign({ userId }, process.env.JWT_KEY as string, { expiresIn: '1h' })
}