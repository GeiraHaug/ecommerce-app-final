# 🛒 E-commerce App (Fullstack Noroff Exam Project)

Dette er et fullstack-prosjekt utviklet som del av avsluttende eksamen ved Noroff Backend-utvikling. Applikasjonen simulerer en nettbutikk med brukerpålogging, produktbehandling, og API-endepunkter for både brukere og administrator.

## 🔧 Teknologi brukt
**Backend:**
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT
- Jest + Supertest
- Swagger (autogenerert dokumentasjon)

**Frontend:**
- EJS (template rendering)
- Bootstrap
- express-session
- Fetch API

## 🎯 Funksjonalitet
- CRUD på produkter og brukere
- Brukerautentisering (admin)
- Token-basert tilgangskontroll
- Swagger-dokumentasjon for alle API-endepunkter
- Delvis frontend for administrasjon (pålogging, navigering, produktregistrering)

## 🧠 Hva jeg lærte
- Hvordan strukturere en fullstack-applikasjon fra bunn
- Relasjonsmodellering i MySQL/Sequelize
- Implementering av autentisering og tilgangskontroll
- Testing med Jest og Supertest
- Praktisk bruk av miljøvariabler, sessions og middleware

## 🚀 Hvordan kjøre lokalt

1.  Klon repoet:
    ```bash
    git clone https://github.com/GeiraHaug/ecommerce-app-final.git
    ```


2.  Installer dependencies:
    cd back-end
    npm install

    cd ../front-end
    npm install

3.  Sett opp .env-filer i både /back-end og /front-end:
    ```
    # back-end .env
    HOST=localhost
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=securepassword
    DATABASE_NAME=ecommerce_db
    DIALECT=mysql
    PORT=3001
    TOKEN_SECRET=your_token_secret

    # front-end .env
    BACKEND_API_URL=http://localhost:3001
    PORT=3000
    ```

4. Start serverne:
   - Back-end: `npm start`
   - Front-end (ny terminal): `npm start`

5. Swagger-dokumentasjon:
   - Åpne: [http://localhost:3001/doc](http://localhost:3001/doc)



📫 Spørsmål eller tilbakemeldinger?
Kontakt meg gjerne på haugengeira@gmail.com