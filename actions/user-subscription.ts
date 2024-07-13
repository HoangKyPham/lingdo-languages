"use server"

import { getUserSubscription } from "@/db/queries";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";


const returnUrl = absoluteUrl("/shop")

export const createStripeUrl = async () => {
    const {userId} = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("Unauthorized")
    }

    const userSubscription = await getUserSubscription();

    // if (userSubscription && userSubscription.stripeCustomerId) {
    //     const stripeSession = await stripe.billingPortal.sessions.create({
    //         customer : userSubscription.stripeCustomerId,
    //         return_url: returnUrl
    //     });

    //     return {data : stripeSession.url}
    // }

    const vnPaySession = await fetch(`http://localhost:8080/api/v1/create-payment-url`, {
        method : "GET",
        headers : {
            "Content-Type": "application/json"
        }
    })

    return {data: vnPaySession.url}
}

