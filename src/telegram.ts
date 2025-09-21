import PQueue from 'p-queue';

import { JSUtils } from './js.js';

const queue = new PQueue({ concurrency: 1 });

const baseUrl = 'https://api.telegram.org/';

export class TelegramUtils {
  static async sendNotification(
    text: string,
    chatId: string,
    botToken: string,
  ) {
    await fetch(`${baseUrl}bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
  }

  static async sendDocument(
    blob: Blob,
    filename: string,
    chatId: string,
    botToken: string,
    caption?: string,
  ) {
    const url = `${baseUrl}bot${botToken}/sendDocument`;
    const formData = new FormData();

    formData.append('chat_id', chatId);
    formData.append('document', blob, filename);
    if (caption) formData.append('caption', caption);

    await fetch(url, {
      method: 'POST',
      body: formData,
    });
  }

  static async queueNotification(
    text: string,
    chatId: string,
    botToken: string,
  ) {
    await queue.add(async () => {
      try {
        await TelegramUtils.sendNotification(text, chatId, botToken);
      } catch {}
      await JSUtils.sleep(3000);
    });
  }

  static async queueDocument(
    blob: Blob,
    filename: string,
    chatId: string,
    botToken: string,
    caption?: string,
  ) {
    await queue.add(async () => {
      try {
        await TelegramUtils.sendDocument(
          blob,
          filename,
          chatId,
          botToken,
          caption,
        );
      } catch {}
      await JSUtils.sleep(3000);
    });
  }

  static async waitForQueue() {
    await queue.onIdle();
  }
}
