import { Challenge, ChallengeProgress, Lesson, Unit } from "@/db/interfaces";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";


// call Api

export const getUserProgress = cache(async () => {
    try {
        const user = await currentUser();
        const emailAddress = user?.emailAddresses[0].emailAddress
        if (!emailAddress) {
            return null
        }

        const response = await fetch(`http://localhost:8080/api/v1/get-user-progress`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ emailAddress })
        })

        const data = await response.json();


        return data
    } catch (error) {
        return error
    }
})

// unit

export const getUnits = cache(async () => {
    try {
        const { userId } = await auth();
        const userProgress = await getUserProgress();



        if (!userId || !userProgress.user?.activeCourse._id) {
            return [];
        }


        const activeCourseId = userProgress.user.activeCourse._id

        const response = await fetch(`http://localhost:8080/api/v1/get-units`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ activeCourseId })
        })

        const data = await response.json();

        const normalizedData = data.result.map((unit : Unit) => {
            const lessonWithCompletedStatus = unit.lessons?.map((lesson : Lesson) => {

                if (lesson.challenges?.length === 0) {
                    return { ...lesson, completed: false }
                }
                const allCompletedChallenges = lesson.challenges?.every((challenge : Challenge) => {

                    return challenge.challengeProgresses
                        && challenge.challengeProgresses.length > 0
                        && challenge.challengeProgresses.filter((progress) => progress.completed === true)
                })

                return { ...lesson, completed: allCompletedChallenges }
            })

            return { ...unit, lessons: lessonWithCompletedStatus }
        })

        return normalizedData
    } catch (error) {
        return error
    }

})

// course

export const getCourses = cache(async () => {

    try {

        const response = await fetch(`http://localhost:8080/api/v1/get-courses`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const data = await response.json();

        if (!data) {
            return null
        }

        return data
    } catch (error) {
        return error
    }


})

export const getCoursesById = cache(async (courseId: string) => {

    console.log(courseId)

    const response = await fetch(`http://localhost:8080/api/v1/get-course-by-id`, {
        method : 'POST',
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify({courseId})
    })

    const data = await response.json()

    console.log(data)

    return data
})


// unit

export const getCourseProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();


    if (!userId || !userProgress.user?.activeCourse) {
        return null
    }

    
    const activeCourseId = userProgress.user?.activeCourse._id


    const response = await fetch(`http://localhost:8080/api/v1/get-course-progress`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ activeCourseId, email: userProgress.user.email })
    })



    const unitsInActiveCourse = await response.json();

    const firstUncompletedLesson = unitsInActiveCourse.result
        .flatMap((unit : Unit) => unit.lessons)
        .find((lesson : Lesson) => {
            return lesson.challenges?.some((challenge : Challenge) => {
                return !challenge.challengeProgresses
                    || challenge.challengeProgresses.length === 0
                    || challenge.challengeProgresses.some((progress) =>  progress.completed === false)
            })
        })

    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?._id

    }
})

// lesson
export const getLesson = cache(async (id?: string) => {
    const user = await currentUser();
    const emailAddress = user?.emailAddresses[0].emailAddress

    if (!emailAddress) {
        return null
    }

    const courseProgress = await getCourseProgress();

    const lessonId = id || courseProgress?.activeLesson._id;

    if (!lessonId) {
        return null
    }


    const response = await fetch(`http://localhost:8080/api/v1/get-lesson`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ lessonId, emailAddress })
    })

    const data = await response.json()


    if (!data || !data.lesson.challenges) {
        return null
    }


    const normalizedChallenges = data.lesson.challenges.map((challenge : Challenge) => {
        const completed = challenge.challengeProgresses
            && challenge.challengeProgresses.length > 0
            && challenge.challengeProgresses.every(progress => progress.completed)

        return { ...challenge, completed }
    })
    return { ...data, challenges: normalizedChallenges }
})


export const getLessonPercentage = cache(async () => {
    const courseProgress = await getCourseProgress();


    if (!courseProgress?.activeLesson._id) {
        return 0;
    }

    const { lesson } = await getLesson(courseProgress?.activeLesson._id);

    if (!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges.filter((challenge : any) => challenge.challengeProgresses?.completed)


    const percentage = Math.round(
        (completedChallenges.length / lesson.challenges.length) * 100,
    )


    return percentage

})

const DAY_IN_MS = 86_400_000
export const getUserSubscription = cache(async () => {


    try {
        const user = await currentUser();
        const emailAddress = user?.emailAddresses[0].emailAddress


        if (!emailAddress) {
            return null;
        }


        const respone = await fetch(`http://localhost:8080/api/v1/get-user-subsctiption`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ emailAddress })
        })

        const data = await respone.json()

        if (!data) {
            return null
        }

        const isActive = data.vnPayPriceId && data.vnPayCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

        return {
            ...data,
            isActive: !!isActive,
        }
    } catch (error) {
        return error
    }

})

export const getTopTenUsers = cache(async () => {
    const { userId } = await auth();

    const user = await currentUser();
    const emailAddress = user?.emailAddresses[0].emailAddress

    if (!emailAddress) {
        return [];
    }


    const respone = await fetch(`http://localhost:8080/api/v1/get-top-users`, {
        method : "GET",
        headers : {
            "Content-Type": "application/json"
        },
    })

    const {data} = await respone.json()

    console.log(data)

    return data

})


