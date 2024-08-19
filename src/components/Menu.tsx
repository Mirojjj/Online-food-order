
import { FunctionComponent, useState } from "react";
import { api } from "src/utils/api";
import Select from "react-select";
import { capitalize, selectOptions } from "src/utils/helpers";
import Image from "next/image";
import { HiArrowLeft } from "react-icons/hi";

interface MenuProps {
    selectedTime: string,
}
 
const Menu: FunctionComponent<MenuProps> = ({selectedTime}) => {

    const [filter, setFilter] = useState<undefined|string>("")
    const {data: menuItem, refetch} = api.menu.getMenuItems.useQuery();

    const filteredMenuItems = menuItem?.filter((menuItem)=> {
        if(!filter) return true;
        return menuItem.categories.includes(filter);
    })

    return <>
     <div className='bg-white'>

      <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 lg:max-w-full'>
        <h1 className="text-6xl mb-8 text-yellow-500 font-extrabold ">Foodies</h1>
        <div className='flex w-full justify-between'>
          <h2 className='flex items-center gap-4 text-2xl font-bold tracking-tight text-gray-900'>
            {/* <HiArrowLeft className='cursor-pointer' onClick={() => router.push('/')} /> */}
            On our menu
          </h2>
          <Select
            onChange={(e) => {
              if (e?.value === 'all') setFilter(undefined)
              else setFilter(e?.value)
            }}
            className='border-none outline-none'
            placeholder='Filter by...'
            options={selectOptions}
          />
        </div>

        <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {filteredMenuItems?.map((menuItem) => (
            <div key={menuItem.id} className='group relative'>
              <div className='min-h-80 aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 hover:opacity-75 xs:h-80'>
                <div className='relative h-full w-full object-cover object-center sm:h-full sm:w-full'>
                  <Image src={menuItem.imageKey} alt={menuItem.name} fill style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className='mt-4 flex justify-between'>
                <div>
                  <h3 className='text-sm text-gray-700'>
                    <p>{menuItem.name}</p>
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    {menuItem.categories.map((c:string) => capitalize(c)).join(', ')}
                  </p>
                </div>
                <p className='text-sm font-medium text-gray-900'>Rs {menuItem.price.toFixed(2)}</p>
              </div>

              {/* <Button
                className='mt-4'
                onClick={() => {
                  addToCart(menuItem.id, 1)
                }}>
                Add to cart
              </Button> */}
            </div>
          ))}
        </div>
      </div>
    </div>
    </> ;
}
 
export default Menu;