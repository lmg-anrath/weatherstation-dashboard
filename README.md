# Wetterstation Dashboard

### Erklärung Dateien:

public/ - Alle genutzten Bilder auf der Website

src/components/ - Einzelteile, aus denen die Website besteht

- Container.vue | Laden der Daten vom Server -> Anzeigen der Graphen & Karte
- TempChart.vue | Visualisierung der Daten in Form von Graphen
- DatePicker.vue | Auswahl des Zeitraums für die Daten
- FilterPanel.vue | Auswahl des Zeitraums mit Buttons "Tag", "Woche", "Monat" und "Jahr"
- MapContainer.vue | Karte mit Positionen der Wetterstationen
- MapOverlay.vue | Wird angezeigt bei Click auf Station auf der Karte -> zeigt aktuelle Daten der Station an
- Seo.vue | Beschreibung der Website + Begriffe für Google Suche

.github/workflows/deploy.yaml - Aktualisiert die Website unter https://wetterstation-lmg.de automatisch bei Änderungen