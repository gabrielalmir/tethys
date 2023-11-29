import os
from fastapi import FastAPI, Form
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from dotenv import load_dotenv

app = FastAPI(debug=True)

load_dotenv()

@app.post("/enviar-msg")
async def enviar_dados(numero: str = Form(...), texto: str = Form(...)):
    # Log the values of numero and texto for debugging
    

    # Send SMS
    message_sid = enviar_sms(numero, texto)

    return {"message_sid": message_sid}

def enviar_sms(numero, texto):
    # Obter credenciais da Twilio do ambiente
    account_sid = os.getenv('ACCOUNT_SID1')
    auth_token = os.getenv('AUTH_TOKEN1')

    # Criar cliente Twilio
    client = Client(account_sid, auth_token)

    # Números de telefone 
    from_phone_number = 'whatsapp:+14155238886'
    to_phone_number = f'whatsapp:+55{numero}'


    # Corpo da mensagem
    message_body = texto

    # Log the values of numero and texto before sending the SMS
    print(f"Enviando Menssagem para {to_phone_number} com o texto : {message_body}")

    # Verificar se o corpo da mensagem não está vazio
    if message_body:
        try:
            # Enviar mensagem
            message = client.messages.create(
                body=message_body,
                from_=from_phone_number,
                to=to_phone_number
            )

            # Imprimir informações sobre o envio bem-sucedido
            print(f"SMS enviado com sucesso, SID: {message.sid}")

            # Retorna o SID da mensagem na resposta da API
            return {"message_sid": message.sid}

        except TwilioRestException as e:
            # Lidar com exceções da Twilio
            if e.code == 21211:
                print(f"Não foi possível realizar a operação. Número de telefone inválido.")
            else:
                print(f"Erro ao enviar o SMS: {e.msg}")
            return {"error": "Erro ao enviar a Menssagem"}

    else:
        # Se o corpo da mensagem estiver vazio
        print("O corpo da mensagem está vazio. Não é possível enviar a Menssagem.")
        return {"error": "O corpo da mensagem está vazio. Não é possível enviar a Menssagem."}
    


