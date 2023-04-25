import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import * as Imap from 'imap';
import { simpleParser } from 'mailparser';
import { MailListener } from 'mail-listener5'
import { TELEGRAM_BOT_SERVICE } from './constants/services';
import { PostEmailDto } from './dto/postEmailDto';

@Injectable()
export class EmailService {
  constructor(@Inject(TELEGRAM_BOT_SERVICE) private emailClient: ClientProxy) { }

  private mailList: string[] = []

  async listen(emailData: PostEmailDto) {
    if (this.mailList.includes(emailData.email)) {
      return 'This email is already listened'
    }
    
    this.mailList.push(emailData.email)

    const rmqTgMessage = {
      subject: '',
      text: '',
      from: '',
    }

    const self = this
    var mailListener = new MailListener({
      username: emailData.email,
      password: emailData.password,
      host: emailData.host,
      port: emailData.port,
      tls: true,
      connTimeout: 10000, // Default by node-imap
      authTimeout: 5000, // Default by node-imap,
      // debug: console.log, // Or your custom function with only one incoming argument. Default: null
      autotls: 'never', // default by node-imap
      tlsOptions: { rejectUnauthorized: false },
      mailbox: "INBOX", // mailbox to monitor
      searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
      markSeen: false, // all fetched email willbe marked as seen and not fetched next time
      fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    });

    mailListener.start(); // start listening

    // stop listening
    //mailListener.stop();

    mailListener.on("server:connected", function () {
      console.log("imapConnected");
    });

    mailListener.on("mailbox", function (mailbox) {
      console.log("Total number of mails: ", mailbox.messages.total); // this field in mailbox gives the total number of emails
    });

    mailListener.on("server:disconnected", function () {
      console.log("imapDisconnected");
    });

    mailListener.on("error", function (err) {
      console.log(err);
    });

    mailListener.on("headers", function (headers, seqno) {
      // do something with mail headers
      console.log(headers.get('subject'), headers.get('from').text);
      rmqTgMessage.from = headers.get('from').text
      rmqTgMessage.subject = headers.get('subject')
    });

    mailListener.on("body", async function (body, seqno) {
      console.log(body.text);
      rmqTgMessage.text = body.text
      await lastValueFrom(self.emailClient.emit('new_message', rmqTgMessage))
    })
    // return 'Started Listening'
  }

  async startListen(): Promise<string> {
    const imapConfig = {
      user: 'tgemailbot@gmail.com',
      password: 'kwmknsckbqimhnrw',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false
      }
    };

    try {
      const imap = new Imap(imapConfig);
      imap.once('ready', () => {
        imap.openBox('INBOX', false, () => {
          imap.search(['UNSEEN'], (err, results) => {
            if (err) throw err;
            else if (!results || !results.length) {
              console.log("The server didn't find any emails matching the specified criteria")
              return
            }
            const f = imap.fetch(results, { bodies: '' });
            f.on('message', msg => {
              msg.on('body', stream => {
                simpleParser(stream, async (err, parsed) => {
                  const { from, subject, text } = parsed;
                  await lastValueFrom(this.emailClient.emit('new_message', { from: from.text, subject, text }))
                });
              });
              msg.once('attributes', attrs => {
                const { uid } = attrs;
                imap.addFlags(uid, ['\\Seen'], () => {
                  // Mark the email as read after reading it
                  console.log('Marked as read!');
                });
              });
            });
            f.once('error', ex => {
              return Promise.reject(ex);
            });
            f.once('end', () => {
              console.log('Done fetching all messages!');
              imap.end();
            });
          });
        });
      });

      imap.once('error', err => {
        console.log(err);
      });

      imap.once('end', () => {
        console.log('Connection ended');
      });

      imap.connect();
    } catch (ex) {
      console.log(ex);
    }

    return 'started listening'
  }
}
