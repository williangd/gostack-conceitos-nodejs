const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoryId(request, response, next) {
  const { id } = request.params;
  const index = repositories.findIndex((repo) => repo.id === id);
  if (index < 0) {
    return response.status(400).json({ message: 'Repository not found' });
  }

  request.repositoryIndex = index;
  next();
}

app.use('/repositories/:id', checkRepositoryId);

app.get('/repositories', (request, response) => {
  response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repo);

  response.json(repo);
});

app.put('/repositories/:id', (request, response) => {
  const { repositoryIndex } = request;

  const { title, url, techs } = request.body;

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };

  response.json(repositories[repositoryIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { repositoryIndex } = request;

  const repo = repositories[repositoryIndex];

  repo.likes++;

  response.json(repo);
});

module.exports = app;
