# Guide de Configuration de l'Espace Administration (ONG)

Ce guide vous accompagne pas à pas dans la configuration de la base de données, la création du compte administrateur et l'accès à l'interface de gestion de la plateforme.

---

## 🛠️ Étape 1 : Démarrer et configurer PostgreSQL

Assurez-vous que votre service PostgreSQL est actif sur votre machine.

### 1. Initialisation de la base de données
Exécutez le script automatique de configuration de la base de données situé dans le dossier du projet backend :

```bash
cd backend
chmod +x setup-db.sh
./setup-db.sh
```

> [!NOTE]
> Ce script va créer :
> - Un utilisateur PostgreSQL : `ong_user` (mot de passe : `ong_password`)
> - Une base de données dédiée : `ong_db`
> - Accorder les privilèges nécessaires.

---

## 🔑 Étape 2 : Configuration des fichiers d'environnement (`.env`)

Les fichiers de configuration `.env` à la racine du projet et dans le sous-dossier `backend` ont été pré-configurés avec les valeurs par défaut suivantes :

```env
# URL de connexion à la base de données
DATABASE_URL="postgresql://ong_user:ong_password@127.0.0.1:5432/ong_db?schema=public"

# Clé secrète pour les tokens JWT
JWT_SECRET="ong_jwt_secret_token_generation_key_2026"
```

> [!IMPORTANT]
> L'utilisation de l'IP locale `127.0.0.1` à la place de `localhost` est fortement recommandée pour éviter les erreurs d'authentification Socket Unix (`Ident authentication failed`).

---

## 🗄️ Étape 3 : Migrations de la base de données (Prisma)

Générez la structure des tables dans la base de données à l'aide de Prisma :

```bash
cd backend
npx prisma migrate dev --name init
```

Cette commande va lire le fichier de schéma Prisma, créer les tables correspondantes (notamment la table `User` et `Testimonial`) et générer le client Prisma.

---

## 👤 Étape 4 : Initialiser le Compte Administrateur

Pour créer (ou réinitialiser) l'utilisateur administrateur par défaut dans la base de données, exécutez la commande suivante :

```bash
cd backend
npm run reset-admin:seed
```

### Identifiants par défaut générés :
- **E-mail** : `admin@ong.org`
- **Mot de passe** : `admin123`

> [!TIP]
> Si vous souhaitez définir un mot de passe personnalisé dès maintenant, exécutez :
> ```bash
> npx ts-node scripts/reset-admin-password.ts MonSuperMotDePasse
> ```

---

## 🚀 Étape 5 : Lancer l'Application

Retournez à la racine du projet et lancez l'application en mode développement :

```bash
cd ..
npm run dev
```

> [!NOTE]
> Grâce au script `concurrently` configuré à la racine, cette commande démarre simultanément :
> - Le serveur **Frontend** sur : [http://localhost:5173](http://localhost:5173)
> - Le serveur **Backend** sur : [http://localhost:5000](http://localhost:5000)

---

## 🖥️ Étape 6 : Accéder à l'Espace Administration

1. Ouvrez votre navigateur et rendez-vous sur la page de connexion : [http://localhost:5173/login](http://localhost:5173/login).
2. Connectez-vous avec les identifiants :
   - **E-mail** : `admin@ong.org`
   - **Mot de passe** : `admin123` (ou le mot de passe personnalisé que vous avez choisi).
3. Une fois connecté, vous serez automatiquement redirigé vers le **Tableau de bord (Dashboard)** d'administration pour gérer les actualités, témoignages, utilisateurs, et dons.
