import { Button } from "@/components/ui/button"
import React, { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { paths } from "@/types/api.types"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import Back from "@/components/Back"

const FormSchema = z.object({
  amount: z.string().min(1, "Please enter a valid amount"),
})

// response status
enum EResponseStatus {
  Agreed = "Agreed",
  Objected = "Objected",
  NotAnswered = "NotAnswered",
}

// response status tag
const StatusTag = {
  [EResponseStatus.Agreed]: (
    <span className="text-green-500 font-bold">Agreed</span>
  ),
  [EResponseStatus.Objected]: (
    <span className="text-red-600 font-bold">Objected</span>
  ),
  [EResponseStatus.NotAnswered]: (
    <span className="text-gray-500 font-bold">Not Answered</span>
  ),
}

// form defination
type FormDefination = z.infer<typeof FormSchema>

// PartyA component
function PartyA() {
  const router = useRouter()
  const { toast } = useToast()

  // form hook
  const form = useForm<FormDefination>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: "1",
    },
  })

  // submit response mutation
  const { mutateAsync: submitAmount } = useMutation({
    mutationFn: (
      requestBody: paths["/submitAmount"]["post"]["requestBody"]["content"]["application/json"]
    ) =>
      fetch("http://127.0.0.1:4010/submitAmount", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  })

  // on submit
  async function onSubmit(data: FormDefination) {
    try {
      await submitAmount({
        amount: parseFloat(data.amount),
      })
      toast({
        title: "Success",
        description: (
          <div>
            <div>Amount submitted successfully.</div>
          </div>
        ),
      })
    } catch (error) {}
  }

  // fetch the response status from party B
  const { data: responseData, refetch: refetchStatus } = useQuery({
    queryKey: ["response_status"],
    queryFn: () =>
      fetch("http://127.0.0.1:4010/getResponse").then(
        (res) =>
          res.json() as paths["/getResponse"]["get"]["responses"]["200"]["content"]["application/json"]
      ),
  })

  // redirect to settled page if party B has agreed
  useEffect(() => {
    if (responseData?.response === EResponseStatus.Agreed) {
      router.push("/settled")
    }
  }, [responseData?.response])

  // fetch if there is a new response from party B, using long polling
  const { data: newResponse } = useQuery({
    queryKey: ["new_response"],
    queryFn: () =>
      fetch("http://127.0.0.1:4010/getAmount").then((res) => res.json()),
    // refetchInterval: 1,  // set refetchInterval to 1 milliseconds, so it will fetch again after success.
    retry: true, // fetch again if failed.
    refetchIntervalInBackground: true,
  })

  //
  useEffect(() => {
    toast({
      title: "New Response from Party B",
      action: (
        <ToastAction altText="Refresh Status" onClick={() => refetchStatus()}>
          Refresh Status
        </ToastAction>
      ),
    })
  }, [newResponse])

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gray-50 `}
    >
      <div className="absolute top-6 left-6">
        <Back />
      </div>
      <div className="bg-white p-6 w-[360px] rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">Response Status: </span>
          <span>
            {responseData?.response &&
              StatusTag[responseData?.response as EResponseStatus]}
          </span>
        </div>
        <InputForm
          form={form}
          onSubmit={onSubmit}
          isNewResponse={!!newResponse}
        ></InputForm>
        <Toaster />
      </div>
    </div>
  )
}

// amount form
export function InputForm(props: {
  form: ReturnType<typeof useForm<FormDefination>>
  onSubmit: (data: z.infer<typeof FormSchema>) => void
  isNewResponse: boolean
}) {
  const { toast } = useToast()

  return (
    <Form {...props.form}>
      <form
        onSubmit={props.form.handleSubmit(props.onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={props.form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          // disabled={props.isNewResponse}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default PartyA
