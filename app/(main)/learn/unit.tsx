import LessonButton from '@/app/(main)/learn/lesson-button';
import UnitBanner from '@/app/(main)/learn/unit-banner';
import { ActiveLesson, Lesson } from '@/db/interfaces';
import React, { useEffect, useState } from 'react'

type Props = {
    id: number;
    order: number;
    title: string;
    description: string;
    lessons: Lesson[];
    activeLesson: ActiveLesson | undefined;
    activeLessonPercentage: number;
}
const Unit = ({ id, order, title, description, lessons, activeLesson, activeLessonPercentage }: Props) => {
    return (
        <>
            <UnitBanner title={title} description={description} />
            <div className="flex items-center flex-col relative">
                {lessons.map((lesson: any, index: number) => {
                    const isCurrent = lesson._id === activeLesson?._id;
                    const isLocked = !lesson.completed && !isCurrent;

                    return (
                        <>
                            <LessonButton
                                key={lesson._id}
                                id={lesson._id}
                                index={index}
                                totalCount={lessons.length - 1}
                                current={isCurrent}
                                locked={isLocked}
                                percentage={activeLessonPercentage}
                            />
                        </>

                    )
                })}
            </div>
        </>
    )
}

export default Unit