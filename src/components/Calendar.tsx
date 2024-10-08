import type { Day } from '@prisma/client'
import { format, formatISO, isBefore, parse } from 'date-fns'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { type FC, useEffect, useState } from 'react'
import { now, ORDER_INTERVAL } from 'src/constants/config'
import { getOpeningTimes, roundToNearestMinutes } from 'src/utils/helpers'
import type { DateTime } from 'src/utils/types'

const DynamicCalendar = dynamic(() => import('react-calendar'), { ssr: false })

interface CalendarProps {
  days: Day[]
  closedDays: string[] // as ISO strings
}

const CalendarComponent: FC<CalendarProps> = ({ days, closedDays }) => {
  const router = useRouter()

  // Determine if today is closed
  const day = days.find(d=>d.dayOfWeek)
  console.log(day)

  const today = days.find(d => d.dayOfWeek === now.getDay());
  if (!today) {
    console.error("No matching day found for today's date.");
  } else{
  console.log("today")
  const rounded = roundToNearestMinutes(now, ORDER_INTERVAL)
  const closing = parse(today!.closeTime, 'kk:mm', now)
  const tooLate = !isBefore(rounded, closing)

  if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)))
  }
  const [date, setDate] = useState<DateTime>({
    justDate: null,
    dateTime: null,
  })


  useEffect(() => {
    if (date.dateTime) {
      localStorage.setItem('selectedTime', date.dateTime.toISOString())
      router.push('/menu')
    }
  }, [date.dateTime, router])

  const times = date.justDate && getOpeningTimes(date.justDate, days)

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      {date.justDate ? (
<div className='flex flex-col items-center'>
<h1 className=' text-violet-700 text-4xl mb-8 font-bold'>Select the time of order</h1>
        <div className='flex max-w-lg flex-wrap gap-4'>
          <button className='rounded-sm bg-gray-100 p-2' onClick={() => setDate((prev) => ({ ...prev, dateTime: now }))} type='button'>as soon as possible</button>
          {times?.map((time, i) => (
            <div className='rounded-sm bg-gray-100 p-2' key={`time-${i}`}>
              <button onClick={() => setDate((prev) => ({ ...prev, dateTime: time }))} type='button'>
                {format(time, 'kk:mm')}
                
              </button>
            </div>
          ))}
        </div>
        </div>
      ) : (
        <div className=' flex flex-col items-center'>
          <h1 className=' text-violet-700 text-4xl mb-8 font-bold'>Select the date of order</h1>
              <DynamicCalendar
          minDate={now}
          className='REACT-CALENDAR p-2'
          view='month'
          tileDisabled={({ date }) => closedDays.includes(formatISO(date))}
          onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date }))}
        />
        </div>
      )}
    </div>
  )
}

export default CalendarComponent