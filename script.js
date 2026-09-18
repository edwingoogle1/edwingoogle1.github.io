const GITHUB_USER = "edwingoogle1";

const grid = document.getElementById("repo-grid");
const statusEl = document.getElementById("status");
const searchEl = document.getElementById("search");
const sortEl = document.getElementById("sort");

document.getElementById("year").textContent = new Date().getFullYear();

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  Rust: "#dea584",
};

let repos = [];

function renderSkeletons(count) {
  grid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "skeleton";
    grid.appendChild(el);
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function repoCard(repo) {
  const a = document.createElement("a");
  a.className = "repo-card";
  a.href = repo.html_url;
  a.target = "_blank";
  a.rel = "noopener";

  const title = document.createElement("div");
  title.className = "repo-card-title";
  title.textContent = repo.name;
  if (repo.fork) {
    const badge = document.createElement("span");
    badge.className = "icon";
    badge.textContent = "(fork)";
    badge.style.fontWeight = "400";
    badge.style.fontSize = "0.8rem";
    title.appendChild(badge);
  }

  const desc = document.createElement("p");
  desc.className = "repo-card-desc";
  desc.textContent = repo.description || "No description provided.";

  const meta = document.createElement("div");
  meta.className = "repo-card-meta";

  if (repo.language) {
    const lang = document.createElement("span");
    lang.className = "meta-item";
    const dot = document.createElement("span");
    dot.className = "lang-dot";
    dot.style.background = LANG_COLORS[repo.language] || "#888";
    lang.appendChild(dot);
    lang.appendChild(document.createTextNode(repo.language));
    meta.appendChild(lang);
  }

  const stars = document.createElement("span");
  stars.className = "meta-item";
  stars.textContent = `★ ${repo.stargazers_count}`;
  meta.appendChild(stars);

  const updated = document.createElement("span");
  updated.className = "meta-item";
  updated.textContent = `Updated ${formatDate(repo.pushed_at)}`;
  meta.appendChild(updated);

  a.append(title, desc, meta);
  return a;
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const sortBy = sortEl.value;

  let filtered = repos.filter((r) =>
    !query ||
    r.name.toLowerCase().includes(query) ||
    (r.description || "").toLowerCase().includes(query) ||
    (r.language || "").toLowerCase().includes(query)
  );

  filtered.sort((a, b) => {
    if (sortBy === "stars") return b.stargazers_count - a.stargazers_count;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return new Date(b.pushed_at) - new Date(a.pushed_at);
  });

  grid.innerHTML = "";
  if (filtered.length === 0) {
    statusEl.textContent = "No projects match your filter.";
    return;
  }
  statusEl.textContent = `${filtered.length} project${filtered.length === 1 ? "" : "s"}`;
  filtered.forEach((r) => grid.appendChild(repoCard(r)));
}

async function loadRepos() {
  renderSkeletons(6);
  statusEl.textContent = "Loading projects…";
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();
    repos = data.filter((r) => !r.private && !r.archived);
    render();
  } catch (err) {
    grid.innerHTML = "";
    statusEl.textContent = `Couldn't load projects (${err.message}). Try refreshing, or visit the GitHub profile directly.`;
    statusEl.classList.add("error");
  }
}

searchEl.addEventListener("input", render);
sortEl.addEventListener("change", render);

loadRepos();
