import { prisma } from './../../db';
import { categories } from './../../../constants/config';
import { v2 as cloudinary } from 'cloudinary'
import { SignJWT } from "jose";
import {publicProcedure, createTRPCRouter, adminPorcedure} from "../trpc";
import {z} from "zod";
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "../../../lib/auth";
import cookie from "cookie"
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
    login: publicProcedure.input(z.object({
        email:z.string().email(),
        password: z.string()
    })). mutation(async({ctx,input})=>{
        const {res} = ctx
        const {email, password}  = input

        console.log({email, password})

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
        {
            //user is authenticated as admin
            const token = await new SignJWT({}).setProtectedHeader({alg: "HS256"}).setJti(nanoid()).setIssuedAt().setExpirationTime("1h").sign(new TextEncoder().encode(getJwtSecretKey()))
            res.setHeader("Set-Cookie", cookie.serialize("user-token", token, {
                httpOnly: true,
                path:"/",
                secure: process.env.NODE_ENV === "production",
            }))

        return {success: true}
        }     
        
        throw new TRPCError({
            code:"UNAUTHORIZED",
            message: "Invalid email or password"
        })
    }),

    addMenuItem: adminPorcedure.input(z.object(
        {
            name:z.string(),
            price: z.number(),
            imageKey: z.string(),
            categories: z.array(z.union([z.literal('breakfast'), z.literal('lunch'), z.literal('dinner')]))   
        }
    )).mutation(async ({ctx, input})=> {
        const {name, price, imageKey, categories} = input
        const menuItem = await ctx.prisma.menuItem.create({
            data:{
                name,
                price,
                categories,
                imageKey,
            }
        })
        return menuItem;
    }),


    deleteMenuItem : adminPorcedure.input(z.object({id: z.string()})).mutation( async({ctx,input})=>{
        const {id} = input;

        //delete image from db
       const menuItem=  await ctx.prisma.menuItem.delete({where: {id}})

         return menuItem;
    }),

    sensitive: adminPorcedure.mutation(()=>{
        return "sensitive";
    })
})