Zadanie 4 Wzorce strukturalne

Echo (Go)
Należy stworzyć aplikację w Go na frameworku echo. Aplikacja ma mieć
jeden endpoint, minimum jedną funkcję proxy, która pobiera dane np. o
pogodzie, giełdzie, etc. (do wyboru) z zewnętrznego API. Zapytania do
endpointu można wysyłać w jako GET lub POST.

✅ 3.0 Należy stworzyć aplikację we frameworki echo w j. Go, która będzie miała kontroler Pogody, która pozwala na pobieranie danych o pogodzie (lub akcjach giełdowych)
[commit](https://github.com/szymnob/projektowanie-obiektowe-2026/commit/0657a6d3268ffa1f14033f7f4f10aefe372ca407)

✅ 3.5 Należy stworzyć model Pogoda (lub Giełda) wykorzystując gorm, a dane załadować z listy przy uruchomieniu
[commit](https://github.com/szymnob/projektowanie-obiektowe-2026/commit/2da1ac643f68e4f3bcf004bda58ba9ba1e87d165)

❌ 4.0 Należy stworzyć klasę proxy, która pobierze dane z serwisu zewnętrznego podczas zapytania do naszego kontrolera

❌ 4.5 Należy zapisać pobrane dane z zewnątrz do bazy danych

❌ 5.0 Należy rozszerzyć endpoint na więcej niż jedną lokalizację (Pogoda), lub akcje (Giełda) zwracając JSONa