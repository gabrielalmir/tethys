import os
from twilio.rest import Client
from dotenv import load_dotenv
from fastapi import FastAPI, Query

app = FastAPI()

load_dotenv()

@app.post("/verificar-sms")
async def verificar_sms(SID: str = Query(..., title="Message SID")):
    account_sid = os.getenv('ACCOUNT_SID1')
    auth_token = os.getenv('AUTH_TOKEN1')

    client = Client(account_sid, auth_token)

    
    mensagem_sid = SID  

   
    mensagem = client.messages(mensagem_sid).fetch()

    # obtem o status da menssagem
    status = mensagem.status

    # retornando o status na resposta
    return {"status_da_mensagem": status}
