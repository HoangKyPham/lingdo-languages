import FeedWrapper from '@/components/feed-wrapper';
import Promo from '@/components/promo';
import Quests from '@/components/quest';
import StickyWrapper from '@/components/sticky-wrapper';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import UserProgess from '@/components/user-progress';
import { UserProgress } from '@/db/interfaces';
import { getTopTenUsers, getUserProgress, getUserSubscription } from '@/db/queries'
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'


const LeaderboardPage = async () => {
    const userProgressData = getUserProgress();
    const userSubscriptionData = getUserSubscription();
    const leaderboardData = getTopTenUsers();


    const [
        userProgress,
        userSubscription,
        leaderboard
    ] = await Promise.all([
        userProgressData,
        userSubscriptionData,
        leaderboardData
    ])

    console.log(userProgress)
    console.log(leaderboard)

    if (!userProgress.user || !userProgress.user.activeCourse) {
        redirect("/courses")
    }

    

    const isPro = !!userSubscription?.isActive

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgess
                    activeCourse={userProgress.user.activeCourse}
                    hearts={userProgress.user.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={isPro}
                />
                {!isPro && (
                    <Promo />
                )}
                <Quests points={userProgress.user.points} />

            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image
                        src="/leaderboard.svg"
                        alt='Leaderboard'
                        height={90}
                        width={90}
                    />
                    <h1 className='text-center font-bold text-neutral-500 text-2xl my-6' >Leaderboard</h1>
                    <p className='text-muted-foreground text-center text-lg mb-6'>See where you stand among other learners in the community</p>
                    <Separator />
                    {leaderboard.map((userProgress : UserProgress, index : number) => (
                        <div
                            key={userProgress.email}
                            className='flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50'
                        >
                            <p className='font-bold text-lime-700 mr-4'>{index + 1}</p>
                            <Avatar
                                className='border bg-green-500 h-12 w-12 ml-3 mr-6'
                            >
                                <AvatarImage
                                    className='object-cover'
                                    src={userProgress.userImageSrc}
                                />
                            </Avatar>
                            <p className='font-bold text-neutral-800 flex-1'>
                                {userProgress.userName}
                            </p>
                            <p className='text-muted-foreground'>
                                {userProgress.points} XP
                            </p>
                        </div>
                    ))}
                </div>
            </FeedWrapper>
        </div>
    )
}

export default LeaderboardPage