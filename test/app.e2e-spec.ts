import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { AuthDto } from "src/auth/dto";
import { domainToASCII } from "url";

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
  });

  afterAll(()=>{
    app.close();
  });

  describe('Auth', ()=> {
    const dto: AuthDto={
      email: 'quocle2208@gmail.com',
      password: '123123',
    };

    describe('Signup', ()=> {

      it('should throw if email empty', () =>{
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signup')
          .withBody({
            password: dto.password,
          }
          )
          .expectStatus(400);
      })

      it('should throw if password empty', () =>{
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signup')
          .withBody({
            email: dto.email,
          }
          )
          .expectStatus(400);
          
      })

      it('should signup', ()=>{
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signup')
          .withBody(dto)
          .expectStatus(201)
        
          
      });
    });

    describe('Signin', ()=> {
      it('should signin', ()=>{
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt','access_token');
          
      })

      it('should throw if email empty', () =>{
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signin')
          .withBody({
            password: dto.password,
          }
          )
          .expectStatus(400);
      })

      it('should throw if password empty', () =>{
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signin')
          .withBody({
            email: dto.email,
          }
          )
          .expectStatus(400);
      })
    });
  });

  describe('User', ()=> {
    describe('Get me', ()=> {
      it('should get current user', ()=>{

        return pactum
          .spec()
          .get('http://localhost:3333/user/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(201)
      })
    });

    describe('Edit user', ()=> {});
  });

  describe('Bookmarks', ()=> {
    describe('Create Bookmark', ()=> {});

    describe('Get bookmarks', ()=> {});

    describe('Get bookmark by id', ()=> {});

    describe('Delete bookmark', ()=> {});
  });



});