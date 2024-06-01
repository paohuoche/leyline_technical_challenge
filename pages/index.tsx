import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className={`flex min-h-screen items-center justify-center bg-white`}>
      <div className="">
        <div className="font-bold text-center mb-4">To Be</div>
        <div className="space-x-2">
          <Link href="/requester">
            <Button variant={"secondary"}>Party A</Button>
          </Link>
          <Link href="recevier">
            <Button>Party B</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
