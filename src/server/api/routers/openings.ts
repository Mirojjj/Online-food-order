import { adminPorcedure, createTRPCRouter } from "../trpc";
import { z} from "zod"
import { formatISO } from "date-fns";

export const openingRouter = createTRPCRouter({
  changeOpeningHours: adminPorcedure.input(
    z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            openTime: z.string(),
            closeTime: z.string(),
        })
    )
  ).mutation(async({ctx,input})=>{
    const results = await Promise.all(
        input.map(async(day)=>{
            const updatedDay = await ctx.prisma.day.update({
                where:{
                    id: day.id,
                },
                data:{
                    closeTime: day.closeTime,
                    openTime: day.openTime,
                }
            })
            return updatedDay;
        })
    )
    return results;
  }) ,

  closeDay: adminPorcedure.input(z.object({date: z.date()})).mutation(async({ctx,input})=>{
    await ctx.prisma.closedDay.create({
        data:{
            date: input.date
        }
    })
  }),

  openDay: adminPorcedure.input(z.object({date: z.date()})).mutation(async({ctx, input})=>{
    await ctx.prisma.closedDay.delete({
        where:{
            date: input.date
        }
    })
  }),

  getClosedDay: adminPorcedure.query(async({ctx})=>{
    const closedDay = await ctx.prisma.closedDay.findMany()

    return closedDay.map(d=>formatISO(d.date));
  })


})