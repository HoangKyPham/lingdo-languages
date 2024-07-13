"use client"

import { upsertUserProgress } from '@/actions/user-progress';
import { Card } from '@/app/(main)/courses/card';
import { Course, ActiveCourse } from '@/db/interfaces'
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react'
import { toast } from 'sonner';

type Props = {
    courses: Course[];
    activeCourse?: ActiveCourse;
}

const List = ({ courses, activeCourse }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();


    const onClick = (id : string) => {
        if (pending) return;

        if (id === activeCourse?._id) {
            return router.push("/learn")
        }

        startTransition(() => {
            upsertUserProgress(id)
                .catch(() => toast.error("Something went wrong"))
        })
    }


    return (
        <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill, minmax(210px,1fr))] gap-4">
            {courses.map((course) => (
                <Card
                    key={course._id}
                    id={course._id || ""}
                    title={course.title}
                    imageSrc={course.imageSrc}
                    onClick={onClick}
                    disabled={pending}
                    active={course._id === activeCourse?._id}
                />
            ))}
        </div>
    )
}

export default List