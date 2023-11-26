<h1>Notificação de alerta de alagamento</h1>
<h3>Olá {{ $data['from_name' ] }}</h3>
<p>
    <small>Este é um e-mail automático, não responda.</small> |
    <small>Enviado em {{ date('d/m/Y H:i:s') }}</small>
</p>

<p>Este é um alerta de alagamento na região de {{ $data['postalcode'] }}.</p>

<p>Atenciosamente,</p>
<p>Equipe Tethys</p>
