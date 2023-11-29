import os
from twilio.rest import Client
from dotenv import load_dotenv
from fastapi import FastAPI, Query

app = FastAPI()

load_dotenv()

@app.post("/verificar-wpp")
async def verificar_sms(SID: str = Query(..., title="Message SID")):
    account_sid = os.getenv('ACCOUNT_SID1')
    auth_token = os.getenv('AUTH_TOKEN1')

    client = Client(account_sid, auth_token)

    # Assuming enviar_sms returns the message SID as a string
    mensagem_sid = SID  # Use the provided SID

    # Fetch the message details
    mensagem = client.messages(mensagem_sid).fetch()

    # Get the status of the message
    status = mensagem.status

    # Returning the status in the response
    return {"status_da_mensagem": status}
