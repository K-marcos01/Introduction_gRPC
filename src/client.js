const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '..', 'proto', 'library.proto');
const SERVER_ADDRESS = 'localhost:50051';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  defaults: true,
});
const libraryProto = grpc.loadPackageDefinition(packageDefinition).library;

// Cree le stub : l'objet qui permet d'appeler le serveur comme une fonction locale (fourni).
function createClient(address = SERVER_ADDRESS) {
  return new libraryProto.LibraryService(address, grpc.credentials.createInsecure());
}

// Etape 3 : appel unary.
// Doit renvoyer une Promise qui se resout avec le livre recu.
function getBook(client, id) {
  return new Promise((resolve, reject) => {
    // TODO etape 3 : appeler client.getBook({ id }, (error, book) => { ... })
    client.getBook({ id }, (error, book) => {
    // Si error existe, appeler reject(error). Sinon, appeler resolve(book).
    if (error) {
      reject(error);
    } else {
      resolve(book);
    }
  });
  });
}

// Etape 5 : appel server streaming.
// Doit renvoyer une Promise qui se resout avec le tableau de tous les livres recus.
function listBooks(client, author) {
  return new Promise((resolve, reject) => {
    const books = [];
    // TODO etape 5 :

    // L'appel génère un stream côté client.
    const call = client.listBooks({author});

    // Evennement déclenché à chaque fois qu'un livre est reçu.
    call.on('data', (book) => {
      books.push(book);
    });

    // Evennement déclenché quand le serveur a fini d'envoyer les livres.
    call.on('end', () => {
      resolve(books);
    });

    // Evennement déclenché si une erreur survient.
    call.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const client = createClient();

  const book = await getBook(client, 1);
  console.log('Livre 1 :', book);

  const books = await listBooks(client, 'Victor Hugo');
  console.log('Livres de Victor Hugo :', books);

  client.close();
}

module.exports = { createClient, getBook, listBooks };

if (require.main === module) {
  main().catch((error) => {
    console.error('Erreur :', error.message);
    process.exit(1);
  });
}
