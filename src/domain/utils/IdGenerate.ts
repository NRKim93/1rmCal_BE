import {PrismaClient} from "@prisma/client";

export  async function idGenerate(key: string): Promise<string>{
    const prisma = new PrismaClient();

    const idValue = await prisma.idtables.findFirstOrThrow({
        select:{
          id_val:true
        },
        where: {
            id_key : key
        }
    })

    const newId = String(idValue.id_val.toNumber()).padStart(4, '0');
    const id = `THE_GYM_${newId}`;

    await prisma.idtables.update({
        where : {
            id_key : key
        },
        data : {
            id_val : idValue.id_val.toNumber() +1
        }
    })

    return id;
}