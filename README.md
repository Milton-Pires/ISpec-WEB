# iSpec – Sistema de Inspeção de Equipamentos de Incêndio

Aplicação web full-stack para gestão e inspeção de equipamentos de combate a incêndio (extintores, alarmes e hidrantes), desenvolvida como Trabalho de Conclusão de Curso (TCC).

O sistema permite o cadastro de equipamentos, o registro de inspeções técnicas e a geração de relatórios, com controle de acesso baseado em perfis de usuário (Administrador, Fiscal e Técnico).

## ✨ Funcionalidades

- Cadastro e gestão de equipamentos de incêndio (extintores, alarmes, hidrantes)
- Registro e acompanhamento de inspeções técnicas
- Autenticação e autorização via JWT, com controle de acesso por perfil
- Login social com Google (OAuth2)
- Geração de relatórios em PDF e Excel
- API REST consumida também por um aplicativo Android complementar

## 🛠️ Tecnologias

**Backend**
- Java 21
- Spring Boot
- Spring Security (JWT)
- MySQL
- iText (geração de PDF)
- Apache POI (geração de Excel)

**Frontend**
- HTML5, CSS3 e JavaScript
- Tailwind CSS

**Mobile**
- Aplicativo Android nativo, consumindo a API via Retrofit

## 🏗️ Arquitetura

- API REST organizada em camadas (controller, service, repository)
- Modelagem de herança das categorias de equipamentos (extintor, alarme, hidrante) utilizando `InheritanceType.JOINED`
- Uso de DTOs dedicados para evitar problemas de serialização/deserialização de subtipos
- Endpoints específicos para operações comuns entre diferentes perfis de usuário (ex: `/usuarios/me`)

## 🚀 Como executar o projeto

### Pré-requisitos
- Java 21+
- Maven
- MySQL

### Passos

```bash
# Clone o repositório
git clone https://github.com/Milton-Pires/ISpec-WEB.git
cd ISpec-WEB

# Configure as credenciais do banco de dados em
# src/main/resources/application.properties

# Execute o projeto
./mvnw spring-boot:run
```

A aplicação estará disponível em `http://localhost:8080`.

## 📸 Capturas de tela

_Em breve._

## 📌 Status do projeto

Concluído – projeto de TCC concluído (06/2026).

## 👤 Autor

**Milton Pires Nunes Neto**
[GitHub](https://github.com/Milton-Pires)