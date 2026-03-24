program SortowanieBabelkowe;

uses sysutils;

type
    TTablica = array of integer;

procedure GenerujLiczby(var tablica: TTablica; od_val: Integer; do_val: Integer; ile: Integer);
var
  i: Integer;
begin
    SetLength(tablica, ile);
    for i := 0 to High(tablica) do
    tablica[i] := Random(do_val - od_val + 1) + od_val;
end;

procedure SortujBabelkowo(var tablica: TTablica);
var
    i, j, temp, n: Integer;
    zamiana: Boolean;
begin
    n := Length(tablica);
    if n <= 1 then Exit;

    for i := 0 to n - 2 do
    begin
    zamiana := False;
    for j := 0 to n - i - 2 do
    begin
        if tablica[j] > tablica[j+1] then
        begin
            temp := tablica[j];
            tablica[j] := tablica[j+1];
            tablica[j+1] := temp;
            zamiana := True;
        end;
    end;
    if not zamiana then Break;
    end;
end;


// Funkcje pomocnicze do testowania
function CzyPosortowana(const arr: TTablica): Boolean;
var i: Integer;
begin
    CzyPosortowana := True;
    for i := 0 to Length(arr) - 2 do
        if arr[i] > arr[i+1] then Exit(False);
end;

function CzyWZakresie(const arr: TTablica; od_val, do_val: Integer): Boolean;
var i: Integer;
begin
    CzyWZakresie := True;
    for i := 0 to Length(arr) - 1 do
        if (arr[i] < od_val) or (arr[i] > do_val) then Exit(False);
end;

procedure UruchomTesty();
var
    TestArr: TTablica;
    Sukcesy: Integer;
begin
    Sukcesy := 0;
    WriteLn('--- URUCHAMIANIE TESTOW JEDNOSTKOWYCH ---');

    { Test 1: Czy generuje poprawną liczbę elementów }
    GenerujLiczby(TestArr, 0, 100, 50);
    if Length(TestArr) = 50 then begin WriteLn('[OK] Test 1: Liczba elementow'); Inc(Sukcesy); end;

    { Test 2: Czy liczby mieszczą się w zakresie }
    if CzyWZakresie(TestArr, 0, 100) then begin WriteLn('[OK] Test 2: Zakres wartosci'); Inc(Sukcesy); end;

    { Test 3: Czy sortuje losową tablicę }
    SortujBabelkowo(TestArr);
    if CzyPosortowana(TestArr) then begin WriteLn('[OK] Test 3: Sortowanie losowych'); Inc(Sukcesy); end;

    { Test 4: Czy radzi sobie z tablicą już posortowaną }
    SortujBabelkowo(TestArr);
    if CzyPosortowana(TestArr) then begin WriteLn('[OK] Test 4: Tablica juz posortowana'); Inc(Sukcesy); end;

    { Test 5: Tablica z takimi samymi elementami }
    GenerujLiczby(TestArr, 10, 10, 10); // same dziesiątki
    SortujBabelkowo(TestArr);
    if CzyPosortowana(TestArr) then begin WriteLn('[OK] Test 5: Same jednakowe liczby'); Inc(Sukcesy); end;

    WriteLn('---------------------------------------');
    WriteLn('Wynik: ', Sukcesy, '/5 testow zaliczonych.');
    WriteLn;
end;

var
    MojaTablica: TTablica;
    i: Integer;
begin
    UruchomTesty();

    WriteLn('Działanie:');
    GenerujLiczby(MojaTablica, 0, 100, 50);

    WriteLn('Wygenerowane liczby:');


    for i := 0 to Length(MojaTablica) - 1 do
        Write(MojaTablica[i], ' ');
    WriteLn;

    WriteLn('Posortowane liczby:');

    SortujBabelkowo(MojaTablica);
  
    for i := 0 to Length(MojaTablica) - 1 do
        Write(MojaTablica[i], ' ');
    WriteLn;
end.