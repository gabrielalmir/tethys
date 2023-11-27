<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Tethys - Sistema de Alerta de Alagamento</title>
    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossorigin="anonymous"
    />
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
        rel="stylesheet"
    />
    <style>
        * {
            font-family: "Open Sans", sans-serif;
            font-size: 16px;
        }

        html,
        body {
            height: 100vh;
        }

        body {
            background-image: url("img/fundo.jpg");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;

            color: #dfdfdf;
        }

        .backdrop {
            backdrop-filter: brightness(60%);
            width: 100vw;
            height: 100vh;
        }

        .nav-link, .nav-link:active, .nav-link:focus {
            color: #ccc;

            border-bottom: 4px solid transparent;
        }

        .nav-link.active {
            color: white;
        }

        .nav-link:hover {
            color: #ccc;
            border-bottom-color: #ccc;
        }

        .cover-container {
            max-width: 60em;
        }

        .cover h1 {
            font-size: 4rem;
            font-weight: bold;
        }

        .cover p {
            font-size: 1.4rem;
            text-wrap: pretty;
        }

        #cta-button {
            background-color: transparent;
            border: 2px solid white;
            color: #dfdfdf;
            font-size: 1.5rem;
            padding: 1rem;
            border-radius: 1rem;
            text-decoration: none;
        }
    </style>
</head>
<body>
<div class="text-center backdrop">
    <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <header class="container mb-auto d-flex justify-content-between">
            <h3 class="masthead-brand">Tethys</h3>
            <nav class="nav justify-content-center">
                <a class="nav-link active" href="/">Início</a>
                @if(str_ends_with(Auth::user()->email, '@tethys.com.br'))
                    <a class="nav-link" href="/admin">Dashboard</a>
                @elseif (Auth::check())
                    <a class="nav-link" href="{{ route('dashboard') }}">Dashboard</a>
                @else
                    <a class="nav-link" href="{{ route('login') }}">Login</a>
                @endif
            </nav>
        </header>

        <main role="main" class="cover">
            <h1>Fique seguro na chuva</h1>
            <p class="lead">
                Nós nos preocupamos com a segurança da população e
                queremos que você fique seguro na chuva. Cadastre seu
                número e receba alertas de alagamento na sua região.
            </p>
            <p class="lead">
                <a href="{{ route('register') }}" class="btn btn-lg btn-secondary" id="cta-button">
                    Cadastre-se
                </a>
            </p>
        </main>

        <footer class="mt-auto">
            <p>Todos os direitos reservados &copy; Tethys 2023</p>
        </footer>
    </div>
</div>
</body>
</html>
