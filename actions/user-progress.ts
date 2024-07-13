"use server"

import { POINTS_TO_REFILL } from "@/constants";
import { getCoursesById, getUserProgress, getUserSubscription } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



export const upsertUserProgress = async (courseId: string) => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthenticated");
    };

    const course = await getCoursesById(courseId);

    if (!course) {
        throw new Error("Course not found");
    };

    const existingUserProgress = await getUserProgress();

    if (existingUserProgress.data) {

        const response = await fetch(`http://localhost:8080/api/v1/update-user-progress`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                emailAddress: user?.emailAddresses[0].emailAddress,
                activeCourseId: courseId,
                userName: user.firstName || "User",
                userImageSrc: user.imageUrl || "/avatar.svg"
            })
        })


        revalidatePath("/courses")
        revalidatePath("/learn")
        redirect("/learn")
    }



    const response = await fetch(`http://localhost:8080/api/v1/insert-user-progress`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            email: user?.emailAddresses[0].emailAddress,
            activeCourse: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/avatar.svg"
        })
    })  

    revalidatePath("/courses")
    revalidatePath("/learn")
    redirect("/learn")
}

export const reduceHearts = async (challengeId: string) => {

    const { userId } = await auth();
    const user = await currentUser();
    const emailAddress = user?.emailAddresses[0].emailAddress

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const currentUserProgress = await getUserProgress();
    const userSubscription = await getUserSubscription();


    const responseChallenge = await fetch(`http://localhost:8080/api/v1/get-challenge-by-id`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ challengeId })

    })

    const challenge = await responseChallenge.json();

    if (!challenge) {
        throw new Error("Challenge not found")
    }

    const lessonId = challenge.lessonId


    const responseExChallengeProgress = await fetch(`http://localhost:8080/api/v1/ex-challenge-progress`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ challengeId, emailAddress })
    })

    const existingChallengeProgress = await responseExChallengeProgress.json();

    const isPractice = !!existingChallengeProgress.challengeProgress


    if (isPractice) {
        return { error: "practice" }
    }

    if (!currentUserProgress.user) {
        throw new Error("User progress not found")
    }

    if (userSubscription?.isActive) {
        return { error: "subscription" }
    }

    if (currentUserProgress.user.hearts === 0) {
        return { error: "hearts" }
    }

    const response = await fetch(`http://localhost:8080/api/v1/update-user-progress`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ emailAddress, hearts: Math.max(currentUserProgress.user.hearts - 1, 0) })
    })

  

    revalidatePath("/shop")
    revalidatePath("/learn")
    revalidatePath("/quests")
    revalidatePath("/leaderboard")
    revalidatePath(`/lesson/${lessonId}`)

}

export const refillHearts = async () => {
    const currentUserProgress = await getUserProgress();


    if (!currentUserProgress.user) {
        throw new Error("User progress not found")
    }

    if (currentUserProgress.user.hearts === 5) {
        throw new Error("Hearts are already full")
    }

    if (currentUserProgress.user.points < POINTS_TO_REFILL) {
        throw new Error("Not enough points")
    }

     await fetch(`http://localhost:8080/api/v1/update-user-progress`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ emailAddress : currentUserProgress.user.email, hearts: 5 , points: currentUserProgress.user.points - POINTS_TO_REFILL })
    })


    revalidatePath("/shop")
    revalidatePath("/learn")
    revalidatePath("/quests")
    revalidatePath("/leaderboard")
}