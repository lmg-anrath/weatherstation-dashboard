# Wetterstation Dashboard

Die Website ist wichtig für die Visualisierung der Wetterdaten, die auf dem [Server](https://github.com/lmg-anrath/weatherstation-server) gespeichert sind. Die Daten werden von dem Server abgefragt, richtig formatiert und dann in geeigneten Graphen visualisiert.

### Erklärung Dateien:

public/ - Alle genutzten Bilder / Grafiken auf der Website

src/components/ - Einzelteile, aus denen die Website besteht

- Container.vue | Laden der Daten vom Server -> Anzeigen der Graphen & Karte
- TempChart.vue | Visualisierung der Daten in Form von Graphen
- DatePicker.vue | Auswahl des Zeitraums für die Daten
- FilterPanel.vue | Auswahl des Zeitraums mit Buttons "Tag", "Woche", "Monat" und "Jahr"
- MapContainer.vue | Karte mit Positionen der Wetterstationen
- MapOverlay.vue | Wird angezeigt bei Click auf Station auf der Karte -> zeigt aktuelle Daten der Station an
- Seo.vue | Beschreibung der Website + Begriffe für Google Suche

src/layouts/Layout.astro - Layout für alle Seiten im Projekt

src/pages/ - Alle aufrufbaren Pfade der Website (bsp. /map)

- index.astro - Startpunkt der Website bei keinem angegebenen Pfad (https://wetterstation-lmg.de/)
- 404.astro - Wird angezeigt wenn der aufgerufene Pfad nicht existiert (bsp. /wetter)

.github/workflows/deploy.yaml - Aktualisiert die Website unter https://wetterstation-lmg.de automatisch bei Änderungen