import { auth } from "@clerk/nextjs/server"

const adminIds = [
    "user_2gJxQEVLf498cIzO54O1o5eRJuh"
]

export const isAdmin = () => {
    const {userId} = auth();

    if (!userId) {
        return false;
    }

    return adminIds.indexOf(userId) !== -1;
}