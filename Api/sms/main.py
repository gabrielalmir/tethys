import os
from fastapi import FastAPI, Form
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from dotenv import load_dotenv

app = FastAPI(debug=True)

load_dotenv()

PHONE_NUMBER = os.getenv('PHONE_NUMBER', '+18452432674')

# Obter credenciais da Twilio do ambiente
ACCOUNT_SID = os.getenv('ACCOUNT_SID1')
AUTH_TOKEN = os.getenv('AUTH_TOKEN1')

@app.post("/enviar-msg")
async def enviar_dados(numero: str = Form(...), texto: str = Form(...)):
    # Log dos valores do numero e do texto para depuração


    # Enviar Menssagem
    message_sid = enviar_sms(numero, texto)

    return {"message_sid": message_sid}

def enviar_sms(numero, texto):
    # Criar cliente Twilio
    client = Client(ACCOUNT_SID, AUTH_TOKEN)

    # Números de telefone
    from_phone_number = f'whatsapp:+{PHONE_NUMBER}'
    to_phone_number = f'whatsapp:+55{numero}'


    # Corpo da mensagem
    message_body = texto

    # Log mostrando os valores antes de enviar a Menssagem
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
            print(f"Menssagem enviada com sucesso, SID: {message.sid}")

            # Retorna o SID da mensagem na resposta da API
            return {"message_sid": message.sid}

        except TwilioRestException as e:
            # Lidar com exceções da Twilio
            if e.code == 21211:
                print(f"Não foi possível realizar a operação. Número de telefone inválido.")
            else:
                print(f"Erro ao enviar a Menssagem: {e.msg}")
            return {"error": "Erro ao enviar a Menssagem"}

    else:
        # Se o corpo da mensagem estiver vazio
        print("O corpo da mensagem está vazio. Não é possível enviar a Menssagem.")
        return {"error": "O corpo da mensagem está vazio. Não é possível enviar a Menssagem."}



