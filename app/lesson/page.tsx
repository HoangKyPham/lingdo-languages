import Quiz from '@/app/lesson/quiz';
import { getLesson, getUserProgress, getUserSubscription } from '@/db/queries'
import { redirect } from 'next/navigation';
import React from 'react'


const LessonPage = async () => {
  const lessonData = getLesson();
  const userProgressData = getUserProgress();
  const userSubsccriptionData = getUserSubscription()


  const [lesson, userProgress, userSubsccription] = await Promise.all([lessonData, userProgressData, userSubsccriptionData])

  
  if (!lesson.lesson || !userProgress.user) {
    redirect("/learn")
  }
  
  const initialPercentage = lesson.lesson.challenges
    .filter(challenge => challenge.completed)
    .length / lesson.challenges.length * 100

  return (
    <Quiz
      initialLessonId={lesson.lesson._id}
      initialLessonChallenges={lesson.lesson.challenges}
      initialHearts={userProgress.user.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubsccription}
    />
  )
}

export default LessonPage