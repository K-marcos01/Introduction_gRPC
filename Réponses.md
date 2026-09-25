1. Quel est le rôle du fichier .proto ? 
Que se passe-t-il si le client et le serveur n'utilisent pas le même ?

Rôle : Il sert de contrat de communication (ou de spécification). 
Il définit exactement les structures de données (messages) et les fonctions disponibles (RPC).   Incompatibilité : Si les deux n'ont pas la même version du contrat, les messages risquent d'être mal décodés ou rejetés, et le client pourrait essayer d'appeler des méthodes qui n'existent pas sur le serveur.

2. Pourquoi ListBooks est-il en server streaming et non en unary ? 
Donnez un cas réel où ce choix compte.

Raison : Une liste de données peut être très volumineuse. En streaming, le serveur envoie les données au fur et à mesure au lieu de tout charger en mémoire pour préparer un gros bloc JSON/Protobuf unique.
Cas réel : L'affichage d'un fil d'actualité en direct, ou l'exportation d'une table de base de données contenant des millions de lignes sans faire exploser la mémoire de l'application.

3. Pourquoi ne peut-on pas tester ce service directement avec un navigateur ?

Les navigateurs web ne gèrent pas nativement le protocole HTTP/2 de bas niveau tel qu'utilisé par gRPC (notamment les trames d'entêtes et de données binaire Protobuf).
Note : Il existe une extension appelée gRPC-Web, mais elle nécessite un proxy (comme Envoy) pour traduire les requêtes du navigateur en gRPC standard.

4. Citez une situation où vous choisiriez plutôt une API REST.

Pour une API publique ouverte à des tiers (ex: développeurs externes, intégrations simples). REST (HTTP/JSON) est universel, facile à tester directement via un navigateur ou curl, et ne nécessite pas de partager un fichier .proto au préalable