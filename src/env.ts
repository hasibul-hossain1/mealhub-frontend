import {createEnv} from "@t3-oss/env-nextjs"
import z from 'zod'

export const env = createEnv({
    client:{
        NEXT_PUBLIC_IMAGEBB_API_KEY:z.string().min(1),
        NEXT_PUBLIC_BACKEND_URL:z.url(),
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:z.string().min(1)
    },
    server:{
        BACKEND_URL:z.url()
    },
    runtimeEnv:{
        NEXT_PUBLIC_IMAGEBB_API_KEY:process.env.NEXT_PUBLIC_IMAGEBB_API_KEY,
        BACKEND_URL:process.env.BACKEND_URL,
        NEXT_PUBLIC_BACKEND_URL:process.env.NEXT_PUBLIC_BACKEND_URL,
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    }
})
