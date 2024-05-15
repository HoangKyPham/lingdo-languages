import "dotenv/config"

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "../db/schema"

const sql = neon(process.env.DATABASE_URL!)
// @ts-ignore
const db = drizzle(sql, {schema});

const main = async () => {
    try {
        console.log("seeding database")

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);

        console.log("1");

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

        await db.insert(schema.units).values([
            {
                id : 1,
                courseId : 1,
                title : " Unit 1",
                description : " Learn the basics of Chinese",
                order : 1
            }
        ])

        await db.insert(schema.lessons).values([
            {
                id : 1,
                unitId : 1,
                order : 1,
                title : "Nouns",
            },
            {
                id : 2,
                unitId : 1,
                order : 2,
                title : "Verbs",
            }
        ])

        await db.insert(schema.challenges).values([
           {
            id: 1,
            lessonId: 1,
            type : "SELECT",
            order : 1,
            question : "Which one of these is the 'the man'?"
           },
           {
            id: 2,
            lessonId: 2,
            type : "SELECT",
            order : 2,
            question : "Which one of these is the 'the man'?"
           },
        ])

        await db.insert(schema.challengeOptions).values([
            {
                id: 1,
                challengeId: 1,
                imageSrc : "/man.svg",
                correct : true,
                text : "ni-hao",
                audioSrc : "/cn_man.mp3"
            },
            {
                id: 2,
                challengeId: 1,
                imageSrc : "/woman.svg",
                correct : false,
                text : "sibaa",
                audioSrc : "/cn_woman.mp3"
            },
            {
                id: 3,
                challengeId: 1,
                imageSrc : "/robot.svg",
                correct : false,
                text : "robot",
                audioSrc : "/cn_robot.mp3"
            },
        ])
        

        console.log("seeding database finished")

    } catch (error) {
        throw new Error("Failed to seed the database")
    }
}