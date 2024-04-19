import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { hash } from "bcryptjs";
import {z} from 'zod'
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";

const createBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})

type createAccaountBodySchema = z.infer<typeof createBodySchema>

@Controller('/accounts')
export class CreateAccount{

    constructor(private prisma: PrismaService){
        
    }

 @Post()
 @UsePipes(new ZodValidationPipe(createBodySchema))
async handle(@Body() body: createAccaountBodySchema){
 
    const {name, email, password} = body

    const userWithSameEmail = await this.prisma.user.findUnique({
        where: {
            email
        }
    })

    if(userWithSameEmail){
        throw new ConflictException('User with same email adress already exists.')
    }

    const hashPassword = await hash(password, 8)

   await this.prisma.user.create({
    data:{
        name,
        email, 
        password: hashPassword
    }
   })
}
}