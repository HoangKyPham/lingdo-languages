"use server"

import { getUserProgress, getUserSubscription } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (challengeId: string) => {
    const { userId } = await auth();
    const user = await currentUser();
    const emailAddress = user?.emailAddresses[0].emailAddress


    if (!userId) {
        throw new Error("Unauthenticated")
    }

    const currentUserProgress = await getUserProgress();
    const userSubscription = await getUserSubscription();


    if (!currentUserProgress.user) {
        throw new Error("User progress not found")
    }

    const responseChallenge = await fetch(`http://localhost:8080/api/v1/get-challenge-by-id`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ challengeId })

    })



    const { challenge } = await responseChallenge.json();


    if (!challenge) {
        throw new Error("Challenge not found")
    }

    const lessonId = challenge.activeLesson;

    const responseExChallengeProgress = await fetch(`http://localhost:8080/api/v1/ex-challenge-progress`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ challengeId, emailAddress })
    })

    const existingChallengeProgress = await responseExChallengeProgress.json();


    const isPractice = !!existingChallengeProgress.challengeProgress;

   


    if (currentUserProgress.user.hearts === 0 && !isPractice && !userSubscription?.isActive) {
        return { error: "hearts" }
    }


    if (isPractice) {

        await fetch(`http://localhost:8080/api/v1/update-challenge-progress`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ existingChallengeProgressId: existingChallengeProgress.challengeProgress._id, completed: true, })
        })


        await fetch(`http://localhost:8080/api/v1/update-user-progress`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({ emailAddress, hearts: Math.min(currentUserProgress.user.hearts + 1, 5), points: currentUserProgress.user.points + 10 })
        })

        revalidatePath("/learn");
        revalidatePath("/lesson");
        revalidatePath("/quests");
        revalidatePath("/leaderboard");
        revalidatePath(`/lesson/${lessonId}`);
        return;
    }

    await fetch(`http://localhost:8080/api/v1/challenge-progress`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ activeChallenge: challengeId, email: emailAddress, completed: true })
    })


    await fetch(`http://localhost:8080/api/v1/update-user-progress`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ emailAddress, points: currentUserProgress.user.points + 10 })
    })

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
}