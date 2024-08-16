import dynamic from "next/dynamic";
import { FunctionComponent, useEffect, useState } from "react";
import type { MultiValue } from 'react-select/dist/declarations/src'
import { selectOptions } from "src/utils/helpers";
import Image from "next/image";
import { MAX_FILE_SIZE } from "src/constants/config";
import { api } from "src/utils/api";
import { Categories } from "@types";



const DynamicSelect = dynamic(() => import('react-select'), { ssr: false })

interface MenuProps {
    
}

interface Input {
    name: string
    price: number
    categories: MultiValue<{value: string; label: string}>
    img: string
}

const initialInput = {
    name : "", 
    price: 0,
    categories: [],
    img: "",
}

const handleTextChange = ()=>{}

 
const Menu: FunctionComponent<MenuProps> = () => {
    const [input, setInput] = useState<Input>(initialInput)
    const [preview, setPreview] = useState<string>("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false);


    const {mutateAsync: addItem} = api.admin.addMenuItem.useMutation();
    const {data: menuItems, refetch} = api.menu.getMenuItems.useQuery();
    const {mutateAsync: deleteMenuItem} = api.admin.deleteMenuItem.useMutation();

    useEffect(()=>{
        if(!input.img) return
        setPreview(input.img);
    }, [input.img])


    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) =>{
            setIsLoading(true);
            if(!e.target.files?.[0]) return setError("No file selectes");
            if(e.target.files[0].size > MAX_FILE_SIZE) return setError("File size should be less than 5mb")
            const pic = e.target.files[0];
            // setInput(prev=>({...prev, file: e.target.files![0]}))

            const data  = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "online-restro")
            data.append("cloud_name", "miroj")
            fetch("https://api.cloudinary.com/v1_1/miroj/image/upload",{
              method: "post",
              body: data,
            }).then((res)=> res.json())
            .then((data)=>{
              setInput(prev=> ({...prev, img: data.url.toString()})
              )
              setIsLoading(false);
            }).catch(err=> {
              console.log(err)
            })
         
    }

   

    const addMenuItem = async () => {
        await addItem({
          name: input.name,
          imageKey: input.img,
          categories: input.categories.map(c=> c.value as Exclude<Categories, "all">),
          price: input.price,
        })  
        refetch();

        setInput(initialInput);
        setPreview("");
    }

    const handleDelete = async (id:string) =>{
      await deleteMenuItem({
        id
      })
      refetch();
    }

    return ( <>
    <div className=''>
        <div className='mx-auto flex max-w-xl flex-col gap-2'>
          <input
            name='name'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='text'
            placeholder='name'
            onChange={(e)=> setInput((prev)=> ({...prev, name: e.target.value}))}
            value={input.name}
          />

          <input
            name='price'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='number'
            placeholder='price'
            onChange={(e) => setInput((prev) => ({ ...prev, price: Number(e.target.value) }))}
            value={input.price}
          />

          <DynamicSelect
            value={input.categories}
            // @ts-expect-error - when using dynamic import, typescript doesn't know about the onChange prop
            onChange={(e) => setInput((prev) => ({ ...prev, categories: e }))}
            isMulti
            className='h-12'
            options={selectOptions}
          />

          <label
            htmlFor='file'
            className='relative h-12 cursor-pointer rounded-sm bg-gray-200 font-medium text-indigo-600 focus-within:outline-none'>
            <span className='sr-only'>File input</span>
            <div className='flex h-full items-center justify-center'>
              {preview ? (
                <div className='relative h-3/4 w-full'>
                  <Image alt='preview' style={{ objectFit: 'contain' }} fill src={preview} />
                </div>
              ) : (
                <span>{isLoading?"Loading image...": "Select Images"}</span>
              )}
            </div>
            <input
              name='file'
              id='file'
              onChange={handleFileSelect}
              accept='image/jpeg image/png image/jpg'
              type='file'
              className='sr-only'
            />
          </label>

          <button
            className='h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed'
            disabled={!input.img || !input.name}
            onClick={addMenuItem}>
              add menu item
          </button>
        </div>
        {error && <p className='text-xs text-red-600'>{error}</p>}

        <div className='mx-auto mt-12 max-w-7xl'>
          <p className='text-lg font-medium'>Your menu items:</p>
          <div className='mt-6 mb-12 grid grid-cols-4 gap-8'>
            {menuItems?.map((menuItem) => (
              <div key={menuItem.id}>
                <p>{menuItem.name}</p>
                <div className='relative h-40 w-40'>
                  <Image priority width={600} height={600} alt='' src={menuItem.imageKey} />
                </div>
                <p>Rs {menuItem.price}</p>
                <button
                  onClick={() => handleDelete(menuItem.id)}
                  className='text-xs text-red-500'>
                  delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </> );
}
 
export default Menu;