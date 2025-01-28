const searchInput = document.querySelector('.search__input');
const findList = document.querySelector('.search__find-list');
const repoList = document.querySelector('.repositories__list');
const debounceGitSearch = debounce(gitSearch, 300);

searchInput.addEventListener('keyup', debounceGitSearch);

async function gitSearch() {
  try {
    if (searchInput.value) {
      clearFind();
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${searchInput.value}&per_page=5`
      );
      const repositories = await response.json();
      repositories.items.forEach((repository) => {
        createElem(repository);
      });
    } else {
      clearFind();
    }
  } catch (e) {
    console.log(e);
  }
}
function createElem(element) {
  const repoElement = document.createElement('li');
  repoElement.addEventListener(
    'click',
    addRepositoryInList(
      element.name,
      element.owner.login,
      element.stargazers_count
    )
  );
  repoElement.classList.add('search__find-elem');
  repoElement.textContent = element.name;
  findList.append(repoElement);
}

function addRepositoryInList(repoName, login, stars) {
  return function () {
    searchInput.value = '';
    clearFind();

    const span = document.createElement('span');
    span.classList.add('repositories__text');
    span.innerHTML = `Name: ${repoName}<br>Owner: ${login}<br>Stars: ${stars}`;

    const btn = document.createElement('button');
    btn.classList.add('repositories__btn-close');

    const listElement = document.createElement('li');
    listElement.classList.add('repositories__find-elem');
    listElement.append(span);
    listElement.append(btn);
    repoList.append(listElement);
  };
}

repoList.addEventListener('click', function (e) {
  let target = e.target;
  if (target.className === 'repositories__btn-close') {
    e.target.closest('.repositories__find-elem').remove();
  }
});

function clearFind() {
  findList.innerHTML = '';
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
