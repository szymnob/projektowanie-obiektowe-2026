FROM debian:stable-slim

RUN apt-get update && apt-get install -y fpc && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY sortowanie.pas .

RUN fpc sortowanie.pas

CMD ["./sortowanie"]