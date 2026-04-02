#!/bin/bash

# Konfiguracja adresów
BASE_URL="http://127.0.0.1:8000/api/products"
GENERATE_URL="http://127.0.0.1:8000/api/products/test/generate-test-data"

echo "==============================================="
echo "   SYMFONY API TEST SCRIPT - ZADANIE 2"
echo "==============================================="

# 1. GENEROWANIE DANYCH TESTOWYCH
echo -e "\n[1/5] Generowanie danych startowych..."
curl -s -X GET "$GENERATE_URL"
echo -e "\nGotowe."

# 2. POBIERANIE WSZYSTKICH PRODUKTÓW (GET)
echo -e "\n[2/5] Pobieranie listy produktów (GET):"
curl -s -X GET "$BASE_URL" | json_pp || curl -s -X GET "$BASE_URL"
echo -e "\n"

# 3. DODAWANIE NOWEGO PRODUKTU (POST)
echo -e "[3/5] Dodawanie nowego produktu 'Klawiatura' (POST):"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
     -H "Content-Type: application/json" \
     -d '{"name": "Klawiatura Mechaniczna", "price": 450, "description": "RGB Cherry MX"}')
echo "$RESPONSE"

# Wyciągamy ID nowo dodanego produktu
ID=$(echo $RESPONSE | grep -oP '(?<="id":)[0-9]+')

# 4. AKTUALIZACJA PRODUKTU (PUT)
if [ ! -z "$ID" ]; then
    echo -e "\n[4/5] Aktualizacja ceny produktu o ID: $ID (PUT):"
    curl -s -X PUT "$BASE_URL/$ID" \
         -H "Content-Type: application/json" \
         -d '{"price": 399}'
    echo -e "\nZaktualizowano."
else
    echo -e "\n[4/5] Pomiń PUT (Nie udało się wyciągnąć ID z odpowiedzi POST)"
fi

# 5. USUWANIE PRODUKTU (DELETE)
if [ ! -z "$ID" ]; then
    echo -e "\n[5/5] Usuwanie produktu o ID: $ID (DELETE):"
    curl -s -X DELETE "$BASE_URL/$ID"
    echo -e "\nUsunięto."
fi

echo -e "\n==============================================="
echo "           KONIEC TESTU"
echo "==============================================="