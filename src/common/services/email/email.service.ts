import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand, Message, Destination } from "@aws-sdk/client-ses";
import { ConfigService } from '@nestjs/config';

interface iBasicMessageInput {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  messageInText: string;
  messageInHtml?: string;
}

@Injectable()
export class EmailsService {
  private client: SESClient;
  private destination: Destination = {};
  private ReplyToAddresses: string[] = [];
  private Message: Message;
  private Source: string = '';

  constructor(private config: ConfigService) {
    this.client = new SESClient({ region: 'us-west-2' });
  }

  async send({ to, from, replyTo, subject, messageInText, messageInHtml }: iBasicMessageInput) {
    this.destination.ToAddresses = [to],
      this.Source = from;
    this.ReplyToAddresses = replyTo ? [replyTo] : [from],
      this.Message = {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: messageInHtml ? messageInHtml : messageInText
          },
          Text: {
            Charset: "UTF-8",
            Data: messageInText
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject
        }
      }

    return this.execute();
  }

  private execute() {
    return new Promise(async (resolve, reject) => {
      const params = {
        Destination: this.destination,
        Message: this.Message,
        Source: this.Source,
        ReplyToAddresses: this.ReplyToAddresses,
      };
      try {
        const sesResponseData = await this.client.send(new SendEmailCommand(params));
        resolve(sesResponseData);
      } catch (e) {
        reject(e);
      }
    });
  };
}
