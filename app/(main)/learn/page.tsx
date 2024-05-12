import Header from '@/app/(main)/learn/header'
import FeedWrapper from '@/components/feed-wrapper'
import StickyWrapper from '@/components/sticky-wrapper'
import UserProgess from '@/components/user-progress'
import { getUserProgress } from '@/db/queries'
import { redirect } from 'next/navigation'
import React from 'react'

const LearnPage = async () => {
  const userProgressData = getUserProgress();

  const [userProgress] = await Promise.all([userProgressData]);

  if(!userProgress || !userProgress.activeCourse){
    redirect("/courses")
  }

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
        <StickyWrapper>
            <UserProgess activeCourse={userProgress.activeCourse} hearts={userProgress.hearts} points={userProgress.points} hasActiveSubscription={false} />
        </StickyWrapper>
        <FeedWrapper>
            <Header title={userProgress.activeCourse.title} />
        </FeedWrapper>
    </div>
  )
}

export default LearnPage
