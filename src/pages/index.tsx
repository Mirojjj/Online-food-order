"use client"

import { type NextPage } from "next";

import Calendar from "../components/calendar"

import { formatISO } from "date-fns";
import { Day } from "@prisma/client"


interface HomeProps{
  days : Day[],
  closedDays: string[]
}

const Home: NextPage<HomeProps> = ({days, closedDays}) => {

  return (
    <>
      <main>
    <Calendar days={days} closedDays ={closedDays}/>
      </main>
    </>
  );
};
export async function getServerSideProps(){
    const days = await prisma?.day.findMany()
    const closedDays = (await prisma!.closedDay.findMany()).map(d=>formatISO(d.date))
    return {props: {days, closedDays}}
}


export default Home;
