import { Get, Query, UseGuards } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const pageQueryParamsSchema = z
.string()
.optional()
.default('1')
.transform(Number)
.pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController{

    constructor(
     private prisma: PrismaService
        ){
        
    }

 @Get()
 //@UsePipes(new ZodValidationPipe(authenticateBodySchema))
async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamsSchema 
    ){

        const perPage = 1

        const questions = await this.prisma.question.findMany({
            take: perPage,
            skip: (page - 1) * perPage,
            orderBy:{
                createdAt: 'desc'
            }
        })

        return{ questions}

 }

    
}