import Header from '@/app/(main)/learn/header'
import Unit from '@/app/(main)/learn/unit'
import FeedWrapper from '@/components/feed-wrapper'
import StickyWrapper from '@/components/sticky-wrapper'
import UserProgess from '@/components/user-progress'
import { getCourseProgress, getLessonPercentage, getUnits, getUserProgress } from '@/db/queries'
import { lessons, units as unitsSchema } from '@/db/schema'
import { redirect } from 'next/navigation'
import React from 'react'

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const unitsData: any = getUnits()
  const courseProgressData: any = getCourseProgress()
  const lessonPercentageData: any = getLessonPercentage()


  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses")
  }

  if(!courseProgress){
    redirect("/course")
  }

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgess activeCourse={userProgress.activeCourse} hearts={userProgress.hearts} points={userProgress.points} hasActiveSubscription={false} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit: any) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={
                courseProgress.activeLesson as typeof lessons.$inferSelect & {
                  unit : typeof unitsSchema.$inferSelect;
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
