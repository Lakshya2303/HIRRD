import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  
import { z } from "zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import useFetch from "@/hooks/useFetch"
import { addNewCompany } from "@/api/apiCompanies"
import { BarLoader } from "react-spinners"
import { useEffect } from "react"

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z.any().refine(file=>file[0] && (
    file[0].type === "image/png" || file[0].type === "image/jpeg"),
    { message: "Only images are allowed" }),
})

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
  })

  const {
    fn:fnAddCompany,
    data:dataAddCompany,
    error:errorAddCompany,
    loading:loadingAddCompany
  } = useFetch(addNewCompany)

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    }).then(() => {
      fetchCompanies();
      reset();
  })
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">Add Company</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a new company</DrawerTitle>
        </DrawerHeader>
        <form className="flex gap-2 p-4 pb-0">
          <Input placeholder="Name" {...register("name")} />
          <Input type="file" accept="image/*" className="file:text-gray-500" {...register("logo")} />
          <Button 
            type="button" 
            onClick={handleSubmit(onSubmit)} 
            variant="destructive" 
            classNamew-40
          >
            Create
          </Button>
        </form>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
        {errorAddCompany && <p className="text-red-500">{errorAddCompany?.message}</p>}
        {loadingAddCompany && <BarLoader width={"100%"} color='#36d7b7'/>}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default AddCompanyDrawer
