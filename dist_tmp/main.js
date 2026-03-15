"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cors_config_1 = require("./common/security/cors.config");
const cookie_util_1 = require("./common/utils/cookie.util");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const options = new swagger_1.DocumentBuilder()
        .setTitle('The Gym\'s API ')
        .setDescription('The Gym 어플리케이션에서 이용하는 API 목록 입니다.')
        .setVersion('1.0.0')
        .addServer('http://localhost:3001/', 'Local environment')
        .addServer('https://dgym.shop/', 'Production')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    app.enableCors(cors_config_1.corsConfig);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    cookie_util_1.CookieUtil.useCookieParser(app);
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
    console.error('Application failed to start:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map