#!/bin/bash

IMAGE_NAME="pascal-sort-app"

echo "Budowanie obrazu Docker..."
docker build -t $IMAGE_NAME .

echo -e "\nUruchamianie aplikacji w kontenerze:\n"
# --rm usuwa kontener automatycznie po zakończeniu działania
docker run --rm $IMAGE_NAME