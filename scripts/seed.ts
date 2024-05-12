import "dotenv/config"


import * as schema from "../db/schema"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

const sql = neon(process.env.DATABASE_URL!)
// @ts-ignore
const db = drizzle(sql, {schema});

const main = async () => {
    try {
        console.log("seeding database")

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);

        await db.insert(schema.courses).values([
            {
                id : 1,
                title : "Chinese",
                imageSrc : "/cn.svg"
            },
            {
                id : 2,
                title : "English",
                imageSrc : "el/.svg"
            },
            {
                id : 3,
                title : "Japanese",
                imageSrc : "/jp.svg"
            },
            {
                id : 4,
                title : "Korean",
                imageSrc : "/kn.svg"
            },
        ])
        console.log("seeding database finished")

    } catch (error) {
        throw new Error("Failed to seed the database")
    }
}