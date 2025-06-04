import { prisma } from "@/app/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req: NextRequest) {

    try {

        const { searchParams } = new URL(req.url);

        const name = searchParams.get("name");
        const age = searchParams.get("age");
        const color = searchParams.get("color");
        const species = searchParams.get("species");
        const gender = searchParams.get("gender");
        const rescued = searchParams.get("rescued");

        const filters: any = {};

        if (name) {
            filters.name = { contains: name, mode: "insensitive" };
        }

        if (age) {
            filters.age = { contains: age, mode: "insensitive" };
        }

        if (color) {
            filters.color = { contains: color, mode: "insensitive" };
        }

        if (species) {
            filters.species = { contains: species, mode: "insensitive" };
        }

        if (gender && gender != "both") {
            filters.sex = gender;
        }

        if (rescued) {

            const [month, year] = rescued.split(",");

            const { firstDay, lastDay } = getMonthBounds(Number(month), Number(year));

            filters.rescued = {
                gte: firstDay,
                lte: lastDay,
            }
        }

        const data = await prisma.pet.findMany({
            where: filters,
        });

        return NextResponse.json({ data: data, message: filters.rescued }, { status: 200 });


    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



const getMonthBounds = (month: number, year: number) => {

    const firstDay = new Date(year, month, 1);
    firstDay.setHours(0, 0, 0, 0);
    
    const lastDay = new Date(year, month + 1, 0);
    lastDay.setHours(23, 59, 59, 999);

    return { firstDay, lastDay };
};