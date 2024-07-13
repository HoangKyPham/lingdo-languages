import Items from '@/app/(main)/shop/items';
import FeedWrapper from '@/components/feed-wrapper';
import Promo from '@/components/promo';
import Quests from '@/components/quest';
import StickyWrapper from '@/components/sticky-wrapper';
import UserProgess from '@/components/user-progress';
import { getUserProgress, getUserSubscription } from '@/db/queries'
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'


const ShopPage = async () => {
    const userProgressData = getUserProgress();
    const userSubscriptionData = getUserSubscription();

    const [
        userProgress,
        userSubscription
    ] = await Promise.all([
        userProgressData,
        userSubscriptionData
    ])


    if (!userProgress || !userProgress.user) {
        redirect("/courses")
    }

    const isPro = !!userSubscription?.isActive

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgess
                    activeCourse={userProgress.user.activeCourse}
                    hearts={userProgress.user.hearts}
                    points={userProgress.user.points}
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
                        src="/shop.svg"
                        alt='Shop'
                        height={90}
                        width={90}
                    />
                    <h1 className='text-center font-bold text-neutral-500 text-2xl my-6' >Shop</h1>
                    <p className='text-muted-foreground text-center text-lg mb-6'>Spend your points on cool stuff</p>
                    <Items
                        hearts={userProgress.user.hearts}
                        points={userProgress.user.points}
                        hasActiveSubscriptions={isPro}
                    />
                </div>
            </FeedWrapper>
        </div>
    )
}

export default ShopPage