
import crypto from "crypto";


export function generateSessionKey(email: string): string {


    const privateKey = process.env.PRIVATE_KEY;
    const sessionToken = crypto.randomBytes(32).toString("base64");
    const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in environment variables");
    }

    const payload = `${sessionToken}.${exp}`;
    const signature = crypto.createHmac("sha256", privateKey).update(payload).digest("base64");
    const combinedToken = `${sessionToken}.${exp}.${signature}`;
    return combinedToken;

}


export function checkSessionTokenValidity(token: string): boolean {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) return false;

    const [sessionToken, exp, signature] = token.split(".");
    if (!sessionToken || !exp || !signature) return false;

    const expectedSig = crypto
        .createHmac("sha256", privateKey)
        .update(`${sessionToken}.${exp}`)
        .digest("base64");

    const eat = parseInt(exp);
    const now = Math.floor(Date.now() / 1000);

    return signature === expectedSig && now < eat;
}