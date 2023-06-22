let containerDiv = null;
let loadingDiv = null;
let jsonData = null;

let loadedPages = {};
let currentPageNum = 1;

async function fetchData(url = "https://swapi.dev/api/starships/") {
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

function createCard(starshipData) {
  const outerDiv = document.createElement("div");
  const innerDiv = document.createElement("div");
  const nameH1 = document.createElement("h1");
  const nameTextNode = document.createTextNode(starshipData["name"]);
  const classH2 = document.createElement("h2");
  const classTextNode = document.createTextNode(starshipData["starship_class"]);
  const costH2 = document.createElement("h2");
  const costTextNode = document.createTextNode("ᖬ" + starshipData["cost_in_credits"]);

  outerDiv.style.display = "flex";
  outerDiv.style.justifyContent = "space-between";
  outerDiv.style.padding = "10px 20px";
  outerDiv.style.margin = "10px 100px";
  outerDiv.style.backgroundColor = "lightgray";
  outerDiv.style.borderRadius = "25px";
  outerDiv.style.borderBottom = "gray 3px solid";

  innerDiv.style.display = "flex";
  innerDiv.style.flexDirection = "column";

  if (!containerDiv) containerDiv = document.getElementById("card-container");
  containerDiv.appendChild(outerDiv);

  outerDiv.appendChild(innerDiv);
  outerDiv.appendChild(costH2);

  innerDiv.appendChild(nameH1);
  innerDiv.appendChild(classH2);

  nameH1.appendChild(nameTextNode);

  classH2.appendChild(classTextNode);

  costH2.appendChild(costTextNode);

  return outerDiv;
}

function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

async function displayData(url = "https://swapi.dev/api/starships/") {
  pageNumber = 1;
  pageIdx = url.indexOf("?page");

  if (pageIdx != -1) {
    pageIdx += 6;
    pageNumber = url.slice(pageIdx);
  }

  currentPageNum = pageNumber;

  if (!containerDiv) containerDiv = document.getElementById("card-container");
  removeAllChildren(containerDiv);

  if (pageNumber in loadedPages) {
    loadedPages[pageNumber]["cards"].forEach((card) => containerDiv.appendChild(card));
    // containerDiv.appendChild(loadedPages[pageNumber]);
    return;
  }

  console.log("Fetching Data...");
  if (!loadingDiv) loadingDiv = document.getElementById("loading");
  loadingDiv.style.display = "flex";

  jsonData = await fetchData(url);
  console.log(jsonData);
  const results = jsonData["results"];

  loadingDiv.style.display = "none";

  loadedPages[pageNumber] = { previous: jsonData["previous"], next: jsonData["next"], cards: [] };

  results.forEach((starship) => {
    card = createCard(starship);
    loadedPages[pageNumber]["cards"].push(card);
  });

  console.log(loadedPages);
}

function nextPage() {
  console.log("Going to next page...");
  currentPage = loadedPages[currentPageNum];
  if (currentPage["next"]) {
    displayData(currentPage["next"]);
  }
}

function prevPage() {
  console.log("Going to previous page...");
  currentPage = loadedPages[currentPageNum];
  if (currentPage["previous"]) {
    displayData(currentPage["previous"]);
  }
}

displayData();
