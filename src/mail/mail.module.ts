import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'smtp-relay.sendinblue.com',
        port:587,
        auth: {
          user: 'mardonis.bezerra@gmail.com',
          pass: 'xsmtpsib-7ce0d655cf42b3b42cd540003d0e253c9550db21af5d703ef0ba5664fbfb8092-TXzZbDpKJmENc4q3',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      preview:true,
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
