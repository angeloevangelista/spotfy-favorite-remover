# Build image on docker

```bash
$ docker build -t spotify-remover .

$ docker run -it --rm --env-file ./.env spotify-remover
```

Follow `.env.example` format to create a `.env` file on root.
