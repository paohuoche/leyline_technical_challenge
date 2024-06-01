import { Button } from "@/components/ui/button"
import React from "react"

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

const FormSchema = z.object({
  amount: z.string().min(1, "Please enter a valid amount"),
})

// response status
enum EResponseStatus {
  Agreed = "Agreed",
  Objected = "Objected",
  NotAnswered = "Not Answered",
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

// requester component
function Requester() {
  // form hook
  const form = useForm<FormDefination>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: "1",
    },
  })

  // on submit
  async function onSubmit(data: FormDefination) {
    console.log(form.getValues())
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gray-50 `}
    >
      <div className="bg-white p-6 w-[360px] rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">Response Status: </span>
          <span>{StatusTag[EResponseStatus.NotAnswered]}</span>
        </div>
        <InputForm form={form} onSubmit={onSubmit}></InputForm>
        <Toaster />
      </div>
    </div>
  )
}

export function InputForm(props: {
  form: ReturnType<typeof useForm<FormDefination>>
  onSubmit: (data: z.infer<typeof FormSchema>) => void
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
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default Requester
