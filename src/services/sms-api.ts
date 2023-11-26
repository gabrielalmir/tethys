export class SmsService {
  private baseURL = "https://tethys-sms.onrender.com";

  constructor() {}

  async sendSms(phoneNumber: string, message: string) {
    const url = `${this.baseURL}/enviar-dados`;
    const localizedPhoneNumber = phoneNumber.includes("+") ? phoneNumber : `+55${phoneNumber}`

    console.log(`URL: ${url}`)
    console.log(`Enviando SMS para ${localizedPhoneNumber}`)
    console.log(`Mensagem: ${message}`)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        numero: localizedPhoneNumber,
        texto: message,
      }),
    });

    console.log(await response.json())

    return response;
  }
}
