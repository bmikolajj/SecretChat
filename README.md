# SecretChat 🔑💬

## Opis 📖

Aplikacja SecretChat to prosty czat internetowy, który umożliwia użytkownikom wysyłanie wiadomości tekstowych oraz obrazków. Aplikacja obsługuje również specjalne wiadomości z ogniskiem, które mogą zmieniać się w popiół po osiągnięciu określonego progu. Dodatkowo możliwe jest czatowanie z użytkownikiem po podaniu jego nazwy - jeżeli użytkownik o podanej nazwie nie istnieje, pokój czatu jest tworzony bez takowej informacji w celu zapewnienia pełnej anonimowości użytkownikom. Wszystkie pliki (obrazki) usuwane są z serwerów po upływie 24 godzin, chyba, że użytkownik zdecyduje ustawić ten czas na krótszy.

## Funkcje ✨

- Wysyłanie wiadomości tekstowych 📤
- Wysyłanie obrazków 🖼️
- Specjalne wiadomości z ogniskiem 🔥
- Wiadomości prywatne 🔒

## Technologie 🛠️

- Node.js
- Express.js
- TypeScript
- Redis
- Multer
- Canvas
- Dotenv
- JSON Web Token (JWT)
- UUID

## Instalacja 📦

1. Sklonuj repozytorium:
    ```sh
    git clone https://github.com/twoje-repozytorium/chat-app.git
    cd chat-app
    ```

2. Zainstaluj zależności:
    ```sh
    npm install
    ```

3. Skonfiguruj plik `.env`:
    ```plaintext
    REDIS_HOST=adres-redisa
    REDIS_PORT=port-redisa
    REDIS_PASSWORD=twoje-haslo
    JWT_SECRET=twoj-sekret
    ```

4. Build i uruchomienie aplikacji:
    ```sh
    npx tsc
    node dist/app.js
    ```

## Korzystanie z aplikacji lokalnie 🚀

1. Otwórz przeglądarkę i przejdź do `http://localhost:3000`.
2. Zaloguj się lub zarejestruj nowe konto.
3. Rozpocznij czatowanie! 💬

## Prezentacja aplikacji 🎥💻
    TBD