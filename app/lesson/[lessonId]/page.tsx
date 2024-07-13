import Quiz from '@/app/lesson/quiz';
import { getLesson, getUserProgress, getUserSubscription } from '@/db/queries'
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params : {
    lessonId : number
  }
}


const LessonIdPage = async ({params} : Props) => {
    const lessonData = getLesson(params.lessonId);
    const userProgressData = getUserProgress();
    const userSubsccriptionData = getUserSubscription();

    const [lesson, userProgress, userSubsccription] = await Promise.all([lessonData, userProgressData, userSubsccriptionData])


    if (!lesson || !userProgress) {
        redirect("/learn")
    }

    const initialPercentage = lesson.challenges
    .filter(challenge => challenge.completed)
    .length / lesson.challenges.length * 100

  return (
    <Quiz
        initialLessonId={lesson.lesson._id}
        initialLessonChallenges={lesson.challenges}
        initialHearts={userProgress.user.hearts}
        initialPercentage={initialPercentage}
        userSubscription={userSubsccription}
    />
  )
}

export default LessonIdPage