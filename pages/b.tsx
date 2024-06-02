import Back from "@/components/Back"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { paths } from "@/types/api.types"
import { useMutation, useQuery } from "@tanstack/react-query"

function PartyB() {
  // fetch the amount from the Party A
  // this api should be implement for long polling.
  // amount can be undefined, that means the party A has not submitted the amount yet.
  const { data } = useQuery({
    queryKey: ["proposal_account"],
    queryFn: () =>
      fetch("http://127.0.0.1:4010/getAmount").then(
        (res) =>
          res.json() as paths["/getAmount"]["get"]["responses"]["200"]["content"]["application/json"]
      ),
    // refetchInterval: 1,  // set refetchInterval to 1 milliseconds, so it will fetch again after success.
    retry: true, // fetch again if failed.
    refetchIntervalInBackground: true,
  })

  // /submitResponse mutation
  // If party B has reponsed and party A does not resubmit new amount, this api should be return error: "Response already submitted."
  const { mutateAsync } = useMutation({
    mutationFn: (
      requestBody: paths["/submitResponse"]["post"]["requestBody"]["content"]["application/json"]
    ) =>
      fetch("http://127.0.0.1:4010/submitResponse", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  })

  // onDispute
  const onDispute = async () => {
    try {
      await mutateAsync({
        response: "Objected",
      })
      toast({
        title: "Success",
        description: (
          <div>
            <div>Response Objected successfully.</div>
          </div>
        ),
      })
    } catch (error) {}
  }

  // onAgree
  const onAgree = async () => {
    try {
      await mutateAsync({
        response: "Agreed",
      })
      toast({
        title: "Success",
        description: (
          <div>
            <div>Response Agreed successfully.</div>
          </div>
        ),
      })
    } catch (error) {}
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="absolute top-6 left-6">
        <Back />
      </div>

      <div className="bg-white p-6 w-[360px] rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">Proposal amount: </span>
          <span className="text-lg font-bold">{data?.amount}</span>
        </div>

        <div className="flex justify-between gap-6">
          <Button className="grow" variant="destructive" onClick={onDispute}>
            Object
          </Button>
          <Button className="grow" variant="default" onClick={onAgree}>
            Aegree
          </Button>
        </div>
        <Toaster />
      </div>
    </div>
  )
}

export default PartyB
