# pool-front

Interface web pour la gestion d'une piscine municipale. Frontend vanilla connecté à [pool-api](https://github.com/ton-user/pool-api).

> ⚠️ Ce projet nécessite que [pool-api](https://github.com/ton-user/pool-api) soit lancé en local.

---

## Aperçu

| Login | Dashboard |
|-------|-----------|
| ![login](#) | ![dashboard](#) |

---

## Stack technique

- HTML / CSS / JavaScript (Vanilla)
- [Bootstrap 5.3](https://getbootstrap.com/) — UI
- [Bootstrap Icons 1.11](https://icons.getbootstrap.com/) — icônes
- Live Server (WebStorm) — port `5500`

---

## Installation

```bash
git clone https://github.com/ton-user/pool-front.git
cd pool-front
```

Ouvre `index.html` avec WebStorm → icône navigateur, ou tout serveur statique sur le port `5500`.

> Le port 5500 est requis — le CORS de pool-api est configuré pour cette origine.

---

## Routes API consommées

| Méthode | Route | Rôle requis | Description |
|---------|-------|-------------|-------------|
| POST | `/auth/login` | — | Authentification, retourne un JWT |
| GET | `/pool/status` | ALL | Statut et capacité de la piscine |
| POST | `/access/entry` | EMPLOYEE, ADMIN | Enregistrer une entrée |
| POST | `/access/exit` | EMPLOYEE, ADMIN | Enregistrer une sortie |
| GET | `/users` | ADMIN | Liste des utilisateurs |
| GET | `/users/subscriptions` | ADMIN, USER | Abonnements |
| GET | `/users/tickets` | ADMIN, USER | Tickets |

---

## Authentification

Login via `POST /auth/login` → token JWT stocké en `localStorage`.  
Chaque requête inclut le header :

```
Authorization: Bearer <token>
```

Le rôle est extrait du payload JWT pour adapter l'interface (`ADMIN`, `EMPLOYEE`, `USER`).

---

## Structure du projet

```
pool-front/
├── index.html
├── html/
│   ├── dashboard.html
│   └── ...
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── dashboard.js
│   └── pages/
│       ├── access.js
│       ├── users.js
│       └── subscriptions.js
└── css/
    └── style.css
```