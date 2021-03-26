<h1 align="center"><img src="./.github/logo.png" width="200px"></h1>

<h3 align="center">Launchstore</h3>

<p align="center">“O que sabemos é uma gota. O que ignoramos é um oceano.”</p>

<p align="center">
  <a href="#about">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#install">Instalação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#challenge">Desafios</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#technologies">Tecnologias</a>
</p>

## :speech_balloon: Sobre <a name="about"></a>

> Launchstore é um e-commerce utilizando JavaScript e postgreSQL :D

<br />
<table>
  <tr>
    <td colspan="1">Desktop</td>
  </tr>
  <tr>
    <td><img src="./.github/#" width=1000px /></td></td>
  </tr>
</table>

## :warning: Instalação <a name="install"></a>

> Esse projeto usou como SGBD o postgreSQL. Para o funcionamento é preciso realizar algumas configurações:

- Criar o banco de dados:

```sh
CREATE DATABASE launchstore;
```

- Rodar as querys disponíveis em:

```sh
src/config/launchstore.sql
```

- Configurar os dados do seu SGBD em:

```sh
src/config/db.js
```

- Instalar as dependências e iniciar o projeto:

```sh
npm install # instala as dependências...
npm start # roda o projeto...
```

- É possível popular a aplicação através do faker, para isso digite na pasta raiz:

```sh
node seed.js
```

## :triangular_flag_on_post: Desafio <a name="challenge"></a>

> Aprender modelo MVC e todos os conceitos que se aplicam a programação web.

## :heavy_check_mark: Tecnologias <a name="technologies"></a>

- Faker
- Lottie
- Bcrypt
- Multer
- Express
- Nunjucks
- Nodemailer
- PostgreSQL
- Express Session

---

by [Douglas Scaini](https://www.github.com/douglasscaini) ❤️
