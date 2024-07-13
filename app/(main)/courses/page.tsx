import List from '@/app/(main)/courses/list';
import { getCourses, getUserProgress } from '@/db/queries'
import React from 'react'

const CoursesPage = async () => {
    const coursesData =  getCourses();
    const userProgressData =  getUserProgress()

    const [courses, userProgress] = await Promise.all([coursesData, userProgressData])

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
        <h1 className="text-2xl font-bold text-neutral-700">
            Language Courses
        </h1>
        <List courses = {courses.courses} activeCourse={userProgress.user?.activeCourse}/>
    </div>
  )
}

export default CoursesPage