import Header from '@/app/(main)/learn/header'
import Unit from '@/app/(main)/learn/unit'
import FeedWrapper from '@/components/feed-wrapper'
import Promo from '@/components/promo'
import Quests from '@/components/quest'
import StickyWrapper from '@/components/sticky-wrapper'
import UserProgess from '@/components/user-progress'
import { getCourseProgress, getLessonPercentage, getUnits, getUserProgress, getUserSubscription } from '@/db/queries'
// import { lessons, units as unitsSchema } from '@/db/schema'
import { Lesson, Unit as unitsSchema } from '@/db/interfaces'
import { redirect } from 'next/navigation'
import React from 'react'

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const unitsData: any = getUnits()
  const courseProgressData: any = getCourseProgress()
  const lessonPercentageData: any = getLessonPercentage()
  const userSubsccriptionData = getUserSubscription()

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubsccriptionData
  ]);


  if (!userProgress.user || !userProgress.user.activeCourse._id) {
    redirect("/courses")
  }

  if (!courseProgress) {
    redirect("/courses")
  }

  const isPro = !!userSubscription?.isActive

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgess activeCourse={userProgress.user.activeCourse} hearts={userProgress.user.hearts} points={userProgress.user.points} hasActiveSubscription={isPro} />
        {!isPro && (
          <Promo />
        )}
        <Quests points={userProgress.user.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.user.activeCourse.title} />
        {units.map((unit: any) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={
                courseProgress.activeLesson as Lesson & {
                  unit: unitsSchema;
                } | undefined
              }
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
}

export default LearnPage
