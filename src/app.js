const express = require("express");
const cors = require("cors");
const {uuid} = require("uuidv4")

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = []; // Nosso array de armazenamento

function verifyId(request, response, next){// Criamos um middleware para autentificação do id
   const { id } = request.params;
   const repositoryIndex = repositories.findIndex(repository => repository.id === id);
   if(repositoryIndex < 0) {
     return response.status(400).json()
   }
   next();
}
app.use('/repositories/:id', verifyId); // definimos as rotas que irao fazer a verificação
app.get("/repositories", (request, response) => { // retorna a lista de repositorios
  return response.json(repositories);

});

app.post("/repositories", (request, response) => { // cria um novo repositorio
    const {title, url, techs} = request.body;
    const repository = {
     id : uuid(),
     title,
     url,
     techs,
     likes : 0
   }
   repositories.push(repository);
   return response.json(repository);
});

app.put("/repositories/:id", (request, response) => { // altera o repositorio
  const {id} = request.params;
  const {title, url, techs} = request.body; // Campos que serao alterados
  const repository2 = repositories.find(repository => repository.id === id); // Acha o repositorio que queremos alterar
  const repositoryIndex = repositories.findIndex(repository => repository.id === id); // Acha o index do repositorio que queremos alterar
  const repository = {
    id, // mantem o valor do id
    title, 
    url,
    techs,
    likes: repository2.likes // mantemos o valor do like
  }
  repositories[repositoryIndex] = repository; // faz um update nas informações do repositorio que queremos alterar
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {// deleta o repositorio
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id); //varre o array a procura do mesmo elemento que tem o id passado.
  repositories.splice(repositoryIndex, 1); // remove 1 elemento na posição do repositoryIndex

  return response.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {// da um like no repositorio
  const {id} = request.params;
  const repository = repositories.find(repository => repository.id === id); // varre o array para acharmos o repositorio que queremos baseado no id
  repository.likes += 1; // incrementa +1 no numero de likes
  return response.json(repository);
});

module.exports = app;
