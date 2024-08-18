"use client"

import { Day } from "@prisma/client"
import { add, format, formatISO, getMinutes, isBefore, isSameDay, parse, set } from "date-fns"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import ReactCalendar from "react-calendar"
import { OPENING_HOURS_BEGINNING, OPENING_HOURS_END ,ORDER_INTERVAL,now} from "../../constants/config"
import { type DateTime } from "@types"
import { useRouter } from "next/router"
import { getOpeningTimes, roundToNearestMinutes } from "src/utils/helpers"


interface CalendarProps{
  days: Day[]
  closedDays: string[],
}
 
const index: FC<CalendarProps> = ({days, closedDays}) => {

  const router = useRouter()

  const today = days.find((d)=> d.dayOfWeek === now.getDay())
  const rounded = roundToNearestMinutes(now, ORDER_INTERVAL);
  const closing = parse(today!.closeTime, "kk:mm", now)
  const tooLate = !isBefore(rounded, closing)
  if(tooLate) closedDays.push(formatISO(new Date().setHours(0,0,0,0)))

  const [date, setDate] = useState<DateTime>({
    justDate: null,
    dateTime: null,
  })

  useEffect(()=>{
    if(date.dateTime){
      localStorage.setItem('selectedTime', date.dateTime.toISOString())
      router.push("/menu")
    }
  },[date.dateTime])

  const times = date.justDate && getOpeningTimes(date.justDate, days);

//get the  order timesconst
//   const getOrderTimes = () => {
//     if(!date.justDate) return

//     const {justDate} = date;
   

//     let start = add(now, {minutes:45})


// //show different order times according to the order date
//    if(isSameDay(justDate, now)){
//     const minutes = getMinutes(start);
//     const roundedMinutes = Math.ceil(minutes / 15) * 15;
//     start = set(start, { minutes: roundedMinutes });
//    }
//    else{
//      start = add(justDate, {hours: OPENING_HOURS_BEGINNING});
//    }

  
//     const end = add(justDate, {hours: OPENING_HOURS_END})

//     const orderTime  = [];
//     for (let i=start; i<=end; i = add(i, {minutes:ORDER_INTERVAL})){
//       orderTime.push(i)
//     }
//     return orderTime;
//   }

//rac

  return <>
  <div className="flex h-screen flex-col items-center justify-center">
    {
      date.justDate? <div>
        {
          isSameDay(date.justDate, new Date())
          ?
          <div className="flex gap-4 justify-center items-center">
         {OPENING_HOURS_END&& <p className="rounded-sm bg-slate-50 p-2">as soon as possible</p>}
          {orderTimes?.map((time,i)=>(<div key={`time-${i}`} className=" rounded-sm bg-slate-50 p-2">
          <button type="button" onClick={()=>setDate((prev)=>({...prev, dateTime: time}))}>
            {format(time,"kk:mm")}
          </button>
          </div>))}
        </div>
        :
        <div onClick={()=>console.log(new Date())}>
          <div className="flex gap-4 justify-center items-center">
          {orderTimes?.map((time,i)=>(<div key={`time-${i}`} className=" rounded-sm bg-slate-50 p-2">
          <button type="button" onClick={()=>setDate((prev)=>({...prev, dateTime: time}))}>
            {format(time,"kk:mm")}
          </button>
          </div>))}
        </div>
        </div>
        }
      </div> 
      : 
    <ReactCalendar minDate={new Date()} className="REACT-CALENDAR p-2" view="month" tileDisabled={({date})=> closedDays.includes(formatISO(date))} onClickDay={(date: Date) => setDate((prev) => ({ ...prev, justDate: date }))}></ReactCalendar>
    }
  </div>
  </>;
}
 
export default index;