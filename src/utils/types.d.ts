import { categories } from "src/constants/config"
import { number } from "zod"

export type DateTime = {
    justDate: Date | null
    dateTime: Date | null
}

export type Categories = typeof categories[number]