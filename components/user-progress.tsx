import { Button } from '@/components/ui/button';
import { courses } from '@/db/interfaces';
import { InfinityIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type Props = {
    activeCourse : typeof courses.$inferSelect,
    hearts: number,
    points: number,
    hasActiveSubscription: boolean;
}

const UserProgess = ({activeCourse, hearts, points, hasActiveSubscription}: Props) => {

  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
        <Link href="/courses">
            <Button variant="ghost">
                <Image src={activeCourse.imageSrc} alt={activeCourse.title} width={32} height={32}/>
            </Button>
        </Link>
        <Link href="/shop">
            <Button variant="ghost" className='text-orange-500'>
                <Image src="/points.svg" height={28} width={28} alt='Points' className='mr-2'/>
                {points}
            </Button>
        </Link>
        <Link href="/shop">
            <Button variant="ghost" className='text-rose-500'>
                <Image src="/hearts.svg" height={28} width={28} alt='Hearts' className='mr-2'/>
                {hasActiveSubscription ? <InfinityIcon className='h-4 w-4 stroke-[3]' /> : hearts}
            </Button>
        </Link>
    </div>
  )
}

export default UserProgess