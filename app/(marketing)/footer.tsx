import { Button } from "@/components/ui/button"
import Image from "next/image"

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/el.svg" alt="English" height={32} width={40} className="mr-4 rounded-md" />
                    English
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/cn.svg" alt="Chinese" height={32} width={40} className="mr-4 rounded-md" />
                    Chinese
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/jp.svg" alt="Japanese" height={32} width={40} className="mr-4 rounded-md" />
                    Japanese
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/kn.svg" alt="Korean" height={32} width={40} className="mr-4 rounded-md" />
                    Korean
                </Button>
            </div>
        </footer>
    )
}
