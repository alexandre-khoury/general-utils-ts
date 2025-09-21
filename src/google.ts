export class GoogleUtils {
  /**
   * scoreThreshold only required for reCAPTCHA v3
   * 0.5 is a good default
   */
  static async captchaVerify(
    secret: string,
    token: string,
    scoreThreshold?: number,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          body: `secret=${secret}&response=${encodeURIComponent(token)}`,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
        },
      );
      const body = (await response.json()) as {
        success: boolean | undefined;
        score: number | undefined;
      };
      if (body.success) {
        if (scoreThreshold === undefined) {
          // reCaptcha v2
          return true;
        } else {
          if (body.score !== undefined && body.score >= scoreThreshold) {
            return true;
          }
        }
      }
    } catch {
      /* Do nothing */
    }
    return false;
  }
}
