# IMDbPro Production Exporter

Extension locale Chrome/Edge qui exporte les projets visibles avec votre propre session IMDbPro. Elle ne lit, ne stocke et ne transmet aucun identifiant de connexion.

## Installation

1. Ouvrir `chrome://extensions` dans Chrome ou `edge://extensions` dans Edge.
2. Activer le mode développeur.
3. Cliquer sur `Charger l'extension non empaquetée`.
4. Sélectionner le dossier `imdbpro-production-exporter`.

Après une mise à jour, cliquer sur le bouton de rechargement de l'extension puis actualiser la page IMDbPro.

## Utilisation

1. Se connecter à `https://pro.imdb.com`.
2. Ouvrir une fiche entreprise IMDbPro.
3. Ouvrir l'extension et cocher les sections à exporter.
4. Lancer l'extraction. L'extension ouvre les boutons `Show more`.
5. Télécharger le JSON.
6. Dans le panel admin, ouvrir la fiche entreprise et importer le JSON dans la section choisie.
7. Lancer ensuite `Enrichir avec TMDB` pour ajouter les synopsis, affiches, casting et autres données disponibles.

## Modes d'export

### Fiche entreprise

L'export ouvre toutes les lignes des sections choisies, puis visite chaque fiche projet et ses sous-pages IMDbPro pertinentes. Il fusionne les informations générales, le synopsis, le casting, l'équipe, les sociétés, les épisodes, les médias, les sorties, le tournage, les détails techniques, les sites officiels et les anecdotes visibles.

Cette extraction complète peut prendre plusieurs minutes pour une grande filmographie. Les éventuelles fiches en erreur sont indiquées dans `diagnostics.failed_projects`.

### Fiche projet

Sur une URL IMDbPro de type `/title/tt...`, l'extension passe automatiquement en mode détaillé. Elle exporte les informations visibles disponibles :

- synopsis, genres et informations principales ;
- casting et équipe avec les portraits disponibles ;
- affiche, images, sociétés et épisodes ;
- détails techniques complets ;
- pays d'origine, langues et sorties internationales ;
- historique du statut de production ;
- lieux et périodes de tournage ;
- sites officiels et anecdotes visibles.

L'extension lit les onglets et sous-pages de la même fiche, puis fusionne les résultats dans un seul JSON.

Le JSON détaillé peut être collé ou importé dans la catégorie de l'entreprise. L'identifiant IMDb permet de mettre à jour la fiche projet existante.

## Limites

- Seules les données visibles par le compte IMDbPro connecté sont exportées.
- IMDbPro peut modifier son interface et nécessiter une mise à jour des sélecteurs.
- TMDB peut ne pas retrouver certains titres de développement ou titres provisoires. Ceux-ci restent importés et peuvent être complétés manuellement.
