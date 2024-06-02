import React from "react"
import { Button } from "./ui/button"
import { Undo2 } from "lucide-react"
import { useRouter } from "next/router"

const Back = () => {
  const router = useRouter()

  return (
    <Button variant="outline" size="icon" onClick={() => router.push("/")}>
      {/* <ChevronRight className="h-4 w-4" /> */}
      <Undo2 />
    </Button>
  )
}

export default Back
