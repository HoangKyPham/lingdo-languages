import Card from '@/app/lesson/card';
import { challengeOptions, challenges } from '@/db/interfaces'
import { cn } from '@/lib/utils';
import React from 'react'

type Props = {
    options: typeof challengeOptions.$inferSelect[];
    onSelect: (id: number) => void;
    status: "correct" | "wrong" | "none";
    selectedOption?: number;
    disabled?: boolean;
    type: typeof challenges.$inferSelect["type"]
}

const Challenge = ({
    options,
    onSelect,
    status,
    selectedOption,
    disabled,
    type
}: Props) => {
    
    return (
        <div className={cn(
            "grid gap-2",
            type === "ASSIST" && "grid-cols-1",
            type === "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit, minmax(0,1fr))]"
        )}>
            {options.map((option, index) => (
                <Card
                    key={option._id}
                    id={option._id}
                    text={option.text}
                    imageSrc={option.imageSrc}
                    shortcut={`${index + 1}`}
                    selected={selectedOption === option._id}
                    onClick={() => onSelect(option._id)}
                    sttus={status}
                    audioSrc={option.audioSrc}
                    disabled={disabled}
                    type={type}
                />
            ))}

        </div>
    )
}

export default Challenge