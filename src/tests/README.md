# Tests Unitaires - Servitor Backend

## Structure des tests

```
src/tests/
├── mocks/                      # Mocks réutilisables
│   ├── MockServerModel.ts
│   ├── MockUserModel.ts
│   ├── MockMinecraftHandler.ts
│   ├── MockArkHandler.ts
│   ├── MockPassword.ts
│   ├── MockRetour.ts
│   └── MockGetServerAddress.ts
├── fixtures/                   # Données de test
│   ├── ServerFixtures.ts
│   └── UserFixtures.ts
└── unit/
    └── controllers/
        ├── Server.test.ts      # Tests du controller Server
        └── User.test.ts        # Tests du controller User
```

## Lancer les tests

```bash
# Tous les tests
npm test

# Tests en mode watch (relance automatique)
npm run test:watch

# Tests avec coverage
npm run test:cov

# Tests d'un fichier spécifique
npm test Server.test
npm test User.test
```

## Couverture des tests

### User Controller (User.test.ts)

- ✅ createUser
  - Création réussie
  - Validation des champs requis
  - Gestion des utilisateurs existants
  - Gestion des erreurs DB
- ✅ loginUser
  - Connexion réussie
  - Validation email/password
  - Gestion utilisateur inexistant
  - Gestion mot de passe incorrect
  - Gestion erreurs DB
- ✅ readOneUser
  - Récupération par ID
  - Gestion utilisateur inexistant
  - Gestion erreurs DB
- ✅ readAllUsers
  - Liste complète
  - Liste vide
  - Gestion erreurs DB
- ✅ updateUser
  - Mise à jour email
  - Mise à jour mot de passe
  - Validation ancien mot de passe
  - Gestion email déjà utilisé
  - Gestion erreurs
- ✅ deleteUser
  - Suppression réussie
  - Gestion utilisateur inexistant
  - Gestion erreurs DB

### Server Controller (Server.test.ts)

- ✅ createServer
  - Création serveur Minecraft
  - Création serveur ARK
  - Validation paramètres ARK
  - Rejet jeu non supporté
  - Gestion erreurs Docker
- ✅ getAllServers
  - Liste complète
  - Liste vide
  - Gestion erreurs DB
- ✅ getServerById
  - Récupération par ID
  - Gestion serveur inexistant
  - Gestion erreurs DB
- ✅ getServersByUser
  - Liste serveurs d'un utilisateur
  - Gestion utilisateur inexistant
  - Gestion erreurs DB
- ✅ getServersByGame
  - Filtrage par jeu
  - Gestion erreurs DB
- ✅ stopServer
  - Arrêt serveur running
  - Rejet si déjà arrêté
  - Gestion serveur inexistant
  - Gestion erreurs Docker
- ✅ startServer
  - Démarrage serveur stopped
  - Rejet si déjà running
  - Gestion serveur inexistant
  - Gestion erreurs Docker
- ✅ getServerStats
  - Récupération stats complètes
  - Gestion serveur inexistant
  - Gestion containerId manquant
  - Gestion playerInfo null
  - Gestion erreurs Docker
- ✅ deleteServer
  - Suppression serveur stopped
  - Rejet paramètres manquants
  - Rejet serveur inexistant
  - Rejet serveur running
  - Rejet si pas propriétaire
  - Gestion erreurs Docker

## Total Coverage

- **User Controller**: 6 fonctions, ~35 cas de test
- **Server Controller**: 10 fonctions, ~40 cas de test
- **Total**: ~75 tests unitaires

## Principes appliqués

1. **Isolation complète**: Aucun appel réel à DB, Docker, RCON
2. **Mocks réutilisables**: Helpers centralisés dans `/mocks`
3. **Fixtures**: Données de test versionnées
4. **AAA Pattern**: Arrange-Act-Assert
5. **Tests indépendants**: Chaque test peut s'exécuter seul
6. **Reset systématique**: beforeEach() nettoie tous les mocks

## Ajouter de nouveaux tests

1. Créer les mocks nécessaires dans `tests/mocks/`
2. Ajouter les fixtures dans `tests/fixtures/`
3. Créer le fichier de test dans `tests/unit/[category]/`
4. Utiliser les helpers existants pour les requêtes/réponses
5. Suivre le pattern AAA (Arrange-Act-Assert)

## Exemple de test

```typescript
it("devrait faire quelque chose", async () => {
  // Arrange - préparer les mocks et données
  mockFind.mockResolvedValue([...data]);
  const req = createMockRequest();
  const res = createMockResponse();

  // Act - exécuter la fonction testée
  await Controller.method(req, res);

  // Assert - vérifier le comportement
  expect(mockFind).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      message: expect.any(String),
    })
  );
});
```

## Troubleshooting

### Les tests échouent avec "Cannot find module"

- Vérifier que les chemins d'import sont corrects (../../../)
- S'assurer que jest.config.ts pointe vers les bons répertoires

### Les mocks ne fonctionnent pas

- Vérifier que jest.mock() est appelé AVANT l'import du module
- Utiliser resetMocks() dans beforeEach()

### Erreurs de types TypeScript

- S'assurer que tous les mocks ont `as any` si nécessaire
- Vérifier que les fixtures correspondent aux interfaces

## Scripts utiles

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:verbose": "jest --verbose",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```
