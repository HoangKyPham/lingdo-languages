"use client"

import Image from 'next/image'
import React from 'react'

const Promo = () => {
    return (
        <div className='border-2 rounded-xl p-4 space-x-4'>
            <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                    <Image
                        src="/unlimited.svg"
                        alt="Pro"
                        height={26}
                        width={26}
                    />
                    <h3>
                        Upgrade to Pro
                    </h3>
                </div>
                <p className='text-muted-foreground'>Get unlimited hearts and more!</p>
            </div>
        </div>
    )
}

export default Promo