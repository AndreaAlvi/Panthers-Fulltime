# Panthers Fulltime PWA v2

PWA mobile-first per la composizione dei Fulltime Panthers 4:5.

## Novità v2
- trattino bianco tra i due loghi
- rendering canvas con imageSmoothingQuality `high`
- pulsante CENTRA ELEMENTO per foto, FULLTIME e risultato
- due sfumature opzionali: sopra e sotto, inserite tra foto e overlay rossi
- doppio tap / gesture zoom di Safari disabilitati
- due varianti del titolo: FULLTIME pieno oppure FULL pieno + TIME outline bianco
- testi e loghi sempre sopra gli overlay; overlay e sfumature sempre sopra la foto

## Struttura layer
1. Foto
2. Sfumatura sopra/sotto (opzionali)
3. Overlay rosso
4. FULLTIME
5. Risultato
6. Loghi + separatore

## Avvio
Servire la cartella con un server HTTP/HTTPS (GitHub Pages va bene). Aprire `index.html` tramite il server, non come `file://`.
