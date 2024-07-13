"use client"

import { upsertChallengeProgress } from '@/actions/challenge-progress';
import { reduceHearts } from '@/actions/user-progress';
import Challenge from '@/app/lesson/challenge';
import Confetti from "react-confetti"
import Footer from '@/app/lesson/footer';
import Header from '@/app/lesson/header';
import QuestionBubble from '@/app/lesson/question-bubble';
import ResultCard from '@/app/lesson/result-card';
import { challengeOptions, challenges, userSubscription } from '@/db/interfaces';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react'
import { useAudio, useMount, useWindowSize } from 'react-use';
import { toast } from 'sonner';
import { useHeartsModal } from '@/store/use-hearts-modal';
import { open } from 'fs/promises';
import { usePracticeModal } from '@/store/use-practice-modal';

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[]
    })[];
    userSubscription: typeof userSubscription.$inferSelect & {
        isActive: boolean;
    } | null ;
};

const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonChallenges,
    initialLessonId,
    userSubscription
}: Props) => {
    const {open : openHeartsModal} = useHeartsModal()
    const {open : openPracticeModal} = usePracticeModal()

    useMount(() => {
        if (initialPercentage === 100) {
            openPracticeModal();
        }
    })

    const {width, height} = useWindowSize();
    const router = useRouter();

    const [finishAudio] = useAudio({src: "/finish.mp3", autoPlay: true});    
    const [
        correctAudio,
        _c,
        correctControls
    ] = useAudio({src: "/correct.wav"});
    const [
        incorrectAudio,
        _i,
        incorrectControls
    ] = useAudio({src: "/incorrect.wav"});

    const [pending, startTransition] = useTransition();
    const [lessonId] = useState(initialLessonId)
    const [hearts, setHearts] = useState(initialHearts);

    const [percentage, setPercentage] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    });
    console.log(percentage);
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);

        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    })

    const [selectedOption, setSelectedOption] = useState<string>()
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none")

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];


    const onNext = () => {
        setActiveIndex((current) => current + 1)
    }

    const onSelect = (id: string) => {
        console.log(id);
        if (status !== "none") return
        setSelectedOption(id)
    }

    const onContinue = () => {
        if (!selectedOption) return

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }
        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((option) => option.correct)

        if (!correctOption) {
            return
        }   

        console.log(correctOption)

        if (correctOption._id === selectedOption) {
            startTransition(() => {
                console.log(challenge._id)
                upsertChallengeProgress(challenge._id)
                    .then((response) => {
                        console.log(response)
                        if (response?.error === "hearts") {
                            openHeartsModal()
                            return
                        }

                        correctControls.play()
                        setStatus("correct");
                        setPercentage(prev => prev + 100 / challenges.length);

                        console.log(1)

                        if (initialPercentage === 100) {
                            setHearts(prev => Math.min(prev + 1, 5))
                        }
                    })
                    .catch(() => toast.error("Something went wrong. Please try again"))
            })
        } else {
            startTransition(() => {
                reduceHearts(challenge._id)
                    .then((respone) => {
                        if (respone?.error === "hearts") {
                            openHeartsModal()
                            return;
                        }

                        incorrectControls.play()
                        setStatus("wrong");

                        console.log(1)

                        if (!respone?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0))
                        }
                    })
                    .catch (() => toast.error("Something went wrong. Please try again"))
            })
        }
    }

    if(!challenge){
        return (
            <>
                {finishAudio}
                <Confetti 
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                <div className=" flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image
                        src="/finish.svg"
                        alt='finish'
                        className='hidden lg:block'
                        height={100}
                        width={100}
                    />
                    <Image
                        src="/finish.svg"
                        alt='finish'
                        className='block lg:hidden'
                        height={50}
                        width={50}
                    />
                    <h1 className='text-xl lg:text-3xl font-bold text-neutral-700'>
                        Great job <br /> You've complted the lesson.
                    </h1>
                    <div className="flex items-center gap-x-4">
                        <ResultCard 
                            variant="points"
                            value={challenges.length * 10}
                        />
                        <ResultCard 
                            variant="hearts"
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status='completed'
                    onCheck={() => router.push("/learn")}
                />
            </>
        )
    }    

    const title = challenge.type === "ASSIST" ? "Select the correct meaning" : challenge.question


    return (
        <>
            {correctAudio}
            {incorrectAudio}
            <Header
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscriptions={!!userSubscription?.isActive}
            />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className='text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700'>
                            {title}
                        </h1>
                        <div className="">
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question} />
                            )}
                            <Challenge
                                options={options}
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={pending}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    )
}

export default Quiz