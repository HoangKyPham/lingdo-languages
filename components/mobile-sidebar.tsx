import { Sidebar } from '@/components/sidebar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import React from 'react'

export const MobileSidebar = () => {
  return (
    <Sheet>
        <SheetTrigger>
            <Menu className='text-white' />
        </SheetTrigger>
        <SheetContent className='p-0 z-[100]' side="left">
            <Sidebar />
        </SheetContent>
    </Sheet>
  )
}
