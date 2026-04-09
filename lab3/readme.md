Zadanie 3 Wzorce kreacyjne
Spring Boot (Kotlin)
Proszę stworzyć prosty serwis do autoryzacji, który zasymuluje
autoryzację użytkownika za pomocą przesłanej nazwy użytkownika oraz
hasła. Serwis powinien zostać wstrzyknięty do kontrolera (4.5).
Aplikacja ma oczywiście zawierać jeden kontroler i powinna zostać
napisana w języku Kotlin. Oparta powinna zostać na frameworku Spring
Boot. Serwis do autoryzacji powinien być singletonem.

✅3.0 Należy stworzyć jeden kontroler wraz z danymi wyświetlanymi z listy na endpoint’cie w formacie JSON - Kotlin + Spring Boot
[commit](https://github.com/szymnob/projektowanie-obiektowe-2026/commit/6d0d9c94d4494fa9b3b6a4fc710aac9a1b5801d4)

✅ 3.5 Należy stworzyć klasę do autoryzacji (mock) jako Singleton w formie eager
[commit](https://github.com/szymnob/projektowanie-obiektowe-2026/commit/f778f6cfc3164bfe93072325be82e37d596271fd)

✅ 4.0 Należy obsłużyć dane autoryzacji przekazywane przez użytkownika
[commit](https://github.com/szymnob/projektowanie-obiektowe-2026/commit/42d78dacf74a1d15d8e8bd2316c7927cbdd1e3d1)

✅ 4.5 Należy wstrzyknąć singleton do głównej klasy via @Autowired lub kontruktor (constructor injection)
[commit](https://github.com/szymnob/projektowanie-obiektowe-2026/commit/42d78dacf74a1d15d8e8bd2316c7927cbdd1e3d1)

❌ 5.0 Obok wersji Eager do wyboru powinna być wersja Singletona w wersji lazy