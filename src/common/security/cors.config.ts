import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";
import * as process from "node:process";

export const corsConfig : CorsOptions = {
    origin : process.env["CORS_ORIGIN"] || 'http://localhost:3000',
    credentials : true,
    methods : ['GET', "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
};