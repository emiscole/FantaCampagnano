# FantaCampagnano

Applicazione per la gestione e il calcolo degli incontri del Fantacalcio con regole personalizzate FantaCampagnano.

## Caratteristiche
- **Registro Incontri**: Calcolo automatico dei punti basato su voti ed eventi.
- **Database Giocatori**: Autocompletamento e sincronizzazione club/ruolo per la Serie A.
- **Gestione Campionato**: Classifica dinamica con i colori ufficiali delle squadre.
- **Calendario e Storico**: Tracciamento di tutti i match della stagione.

## Come esportare il progetto
Per scaricare il codice completo che puoi caricare su GitHub:
1. Clicca sull'icona **Settings** (ingranaggio) in alto a destra nel pannello di AI Studio.
2. Seleziona **Export**.
3. Scegli **Download as ZIP** o **Export to GitHub**.

## Come pubblicare su GitHub Pages (Metodo Consigliato)
Dopo aver scaricato lo ZIP o esportato il codice:
1. Crea un nuovo repository su GitHub e carica tutti i file.
2. Vai nelle **Settings** del tuo repository su GitHub.
3. Seleziona la tab **Pages** nel menu a sinistra.
4. Sotto **Build and deployment > Source**, cambia da "Deploy from a branch" a **"GitHub Actions"**.
5. Il file `.github/workflows/deploy.yml` che ho creato si occuperà di tutto: compilerà l'app e la renderà online automaticamente.

## Anteprima Locale
Se vuoi vedere l'app sul tuo computer:
1. Estrai lo ZIP.
2. Apri il terminale nella cartella.
3. Installa Node.js se non lo hai.
4. Esegui:
   ```bash
   npm install
   npm run dev
   ```
5. Apri `http://localhost:3000`.
