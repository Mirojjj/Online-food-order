import { createTRPCRouter, publicProcedure } from "../trpc"
import {z} from "zod"

export const sleep = (ms: number) => new Promise((resolve)=> setTimeout(resolve,ms));

export const menuRouter = createTRPCRouter({

    getMenuItems: publicProcedure.query(async ({ctx})=>{
        const menuItems = await ctx.prisma.menuItem.findMany()

        return menuItems;
    } ),

    getCartItems: publicProcedure.input(z.array(
        z.object({
            id: z.string(),
            quantity: z.number()
        })
    )).query(async({ctx, input})=>{
        const menuItems = (
            await ctx.prisma.menuItem.findMany({
                where: {
                    id:{
                        in: input.map(item=>item.id)
                    }
                },
            })
        ).map((p)=>({
            ...p,
            quantity: input.find(item=>item.id === p.id)?.quantity || 0
        }))

        return menuItems;
    }),

    
    checkMenuStatus: publicProcedure.query(async ()=> {
        await sleep(2000);
        return true;
    }),


})

