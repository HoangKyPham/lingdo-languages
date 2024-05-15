import LessonButton from '@/app/(main)/learn/lesson-button';
import UnitBanner from '@/app/(main)/learn/unit-banner';
import { lessons, units } from '@/db/schema';
import React from 'react'

type Props = {
    id: number;
    order : number;
    title : string;
    description : string;
    lessons: (typeof lessons.$inferSelect & {
        completed : boolean
    })[];
    activeLesson : typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect;
    } | undefined;
    activeLessonPercentage : number;

}

const Unit = ({id, order, title, description, lessons, activeLesson, activeLessonPercentage}: Props) => {
  return (
    <>
        <UnitBanner title={title} description={description} />
        <div className="flex items-center flex-col relative">
            {lessons.map((lesson : any, index : number) => {
                const isCurrent = lesson.id === activeLesson?.id;
                const isLocked = !lesson.completed && !isCurrent;
                

                return (
                    <LessonButton 
                        key={lesson.id}
                        id={lesson.id}
                        index={index}
                        totalCount={lessons.length-1}
                        current={ isCurrent}
                        locked={isLocked}
                        percentage={activeLessonPercentage}
                    />
                )
            })}
        </div>
    </>
  )
}

export default Unit