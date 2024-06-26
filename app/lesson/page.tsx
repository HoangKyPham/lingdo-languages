import Quiz from '@/app/lesson/quiz';
import { getLesson, getUserProgress, getUserSubscription } from '@/db/queries'
import { redirect } from 'next/navigation';
import React from 'react'


const LessonPage = async () => {
    const lessonData = getLesson();
    const userProgressData = getUserProgress();
  const userSubsccriptionData = getUserSubscription()


    const [lesson, userProgress, userSubsccription] = await Promise.all([lessonData, userProgressData, userSubsccriptionData])


    if (!lesson || !userProgress) {
        redirect("/learn")
    }

    const initialPercentage = lesson.challenges
    .filter(challenge => challenge.completed)
    .length / lesson.challenges.length * 100

  return (
    <Quiz
        initialLessonId={lesson.id}
        initialLessonChallenges={lesson.challenges}
        initialHearts={userProgress.hearts}
        initialPercentage={initialPercentage}
        userSubscription={userSubsccription}
    />
  )
}

export default LessonPage