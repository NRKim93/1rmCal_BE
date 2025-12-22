import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";
import * as process from "node:process";

const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean); 

export const corsConfig : CorsOptions = {
    origin : origins,
    credentials : true,
    methods : ['GET', "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
};