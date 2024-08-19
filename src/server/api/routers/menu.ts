import { createTRPCRouter, publicProcedure } from "../trpc"

export const sleep = (ms: number) => new Promise((resolve)=> setTimeout(resolve,ms));

export const menuRouter = createTRPCRouter({

    getMenuItems: publicProcedure.query(async ({ctx})=>{
        const menuItems = await ctx.prisma.menuItem.findMany()

        return menuItems;
    } ),

    checkMenuStatus: publicProcedure.query(async ()=> {
        await sleep(2000);
        return true;
    }),
})