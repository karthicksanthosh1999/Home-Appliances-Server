import { createTransport } from 'nodemailer';

export interface IApiResponse<T> {
    message: string,
    statusCode: number,
    success: boolean,
    responses?: T,
    error?: string | object
}

export const transportor = createTransport({
    service: "gmail",
    auth: {
        // user: process.env.AUTH_MAIL as string,
        // pass: process.env.APP_PASS as string
        user: "inbarajan.wizinoa@gmail.com",
        pass: "ptrh tjnr jatb celk"
    }
})

export const currentDateWithTime = (date?: string) => {
    const IST_OFFSET = 5.5 * 60 * 60 * 1000; // Offset for IST (5 hours 30 minutes)

    let formatedDate: Date;
    if (date) {
        const givenDate = new Date(date);
        const result = new Date(givenDate.getTime() + IST_OFFSET);
        formatedDate = result;

    } else {
        const currentDate = new Date();
        const res = new Date(currentDate.getTime() + IST_OFFSET);
        formatedDate = res;
    }
    return formatedDate;
}