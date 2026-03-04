"use client"
import { updateProfileAction } from "@/action/updateProfile.action"
import { toast } from "sonner"
import { useTransition } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function UpdateProfile({ name, imageUrl }: { name: string, imageUrl: string }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateProfileAction(formData)
        toast.success("Profile updated successfully")
      } catch (err: any) {
        toast.error(err.message)
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input name="name" defaultValue={name ?? ""} />
            </Field>
            <Field>
              <Label>Image</Label>
              <Input name="image" defaultValue={imageUrl ?? ""} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
