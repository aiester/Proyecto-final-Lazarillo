(() => {
  "use strict";

  const resultsBody = document.querySelector("#results-body");
  const status = document.querySelector("#status");
  const letters = "a-zñáéíóúü";
  const metrics = [
    ["Palabras", (text) => (text.match(/[a-zñáéíóúü]+/g) || []).length],
    ["Vocales", (text) => (text.match(/[aeiouáéíóúü]/g) || []).length],
    ["Consonantes", (text) => (text.match(/[bcdfghjklmnñpqrstvwxyz]/g) || []).length],
    ["Lázaro", (text) => countLiteral(text, "lázaro")],
    ["ciego", (text) => countLiteral(text, "ciego")],
    ["clérigo", (text) => countLiteral(text, "clérigo")],
    ["arcipreste", (text) => countLiteral(text, "arcipreste")],
    ["mi mujer", (text) => countLiteral(text, "mi\\s+mujer")]
  ];

  function countLiteral(text, literalPattern) {
    const pattern = new RegExp(
      `(?<![${letters}])${literalPattern}(?![${letters}])`,
      "g"
    );
    return (text.match(pattern) || []).length;
  }

  function renderResults(text) {
    const normalizedText = text.toLocaleLowerCase("es");
    const fragment = document.createDocumentFragment();

    for (const [label, count] of metrics) {
      const row = document.createElement("tr");
      const nameCell = document.createElement("th");
      const countCell = document.createElement("td");

      nameCell.scope = "row";
      nameCell.textContent = label;
      countCell.textContent = count(normalizedText).toLocaleString("es");
      row.append(nameCell, countCell);
      fragment.append(row);
    }

    resultsBody.replaceChildren(fragment);
    status.textContent = "Recuento completado";
    status.dataset.state = "success";
  }

  function showError(message) {
    resultsBody.replaceChildren();
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 2;
    cell.className = "placeholder";
    cell.textContent = message;
    row.append(cell);
    resultsBody.append(row);
    status.textContent = "No se pudo analizar";
    status.dataset.state = "error";
  }

  async function loadDefaultText() {
    try {
      const response = await fetch("lazarillo_limpio.txt");
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      renderResults(await response.text());
    } catch (error) {
      console.error("No se pudo cargar lazarillo_limpio.txt:", error);
      showError("No se pudo cargar lazarillo_limpio.txt. Comprueba que el archivo esté publicado junto a la página.");
    }
  }

  loadDefaultText();
})();
