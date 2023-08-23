// после добавления пустого проекта исправить покраску инбокс баттон

let multipleTodoLists = JSON.parse(localStorage.getItem('multipleTodoLists')) || [];
const divMultipleTodoLists = document.querySelector('.js-multiple-todo-lists');
const inboxButton = document.querySelector('.js-inbox');
let toDoStorage = getArrayTasksFromMultipleProject() || [];
let allCheckbox;
let counterProjects = getMaxid(multipleTodoLists);
const multipleProjectButtons = document.getElementsByClassName('js-multiple-list');


// добавление нулевого проета с проверкой
function addZeroProject() {
  inboxButton.dataset.id = 0; // при каждой перезагрузке добавляю на страницу
  let zeroTask = multipleTodoLists.findIndex(object => object.prime === true)
  if (zeroTask == -1) {
    multipleTodoLists.push({ prime: true, tasks: [], id: 0, selected: true, })
    localStorage.setItem('multipleTodoLists', JSON.stringify(multipleTodoLists));
    inboxButton.dataset.id = 0;
    counterProjects += 1;
  }
}

addZeroProject();


function getArrayTasksFromMultipleProject() {
  const id = multipleTodoLists.findIndex(element => element.selected === true);
  if (id !== -1) {
    return multipleTodoLists[id].tasks
  }
}


function updateMultipleList() {
  if (multipleTodoLists) {
    for (let index = 0; index < multipleTodoLists.length; index++) {
      const item = multipleTodoLists[index];
      if (item.prime === true && item.selected === true) {
        inboxButton.classList.add('selected-project');
        continue;
      }
      if (item.name) {
        let button = document.createElement('button');
        button.dataset.id = item.id;
        button.innerText = item.name;
        button.classList.add(`js-multiple-list`)
        button.classList.add('mouseOverOut')

        let span = document.createElement('span');
        span.innerText = 'X';
        span.classList.add('jsRemoveProject')
        span.classList.add('projectHide')
        button.appendChild(span);

        if (item.selected) {
          button.classList.add('selected-project');
        }
        divMultipleTodoLists.prepend(button);
      }
    }
  }
};


updateMultipleList(); // при перезагрузке стр подгрузить проеты


function addProject() {
  if (multipleTodoLists.length >= 5) {
    alert('max 4 project');
    return;
  }
  const userInput = prompt('Project name: ');
  if (!userInput || userInput === ' ') {
    alert('поле не может быть пустым');
    return;
  } else {
    counterProjects += 1;
    removeSelectProject();
    multipleTodoLists.push({
      name: `${userInput}`,
      tasks: [],
      id: counterProjects,
    })
    let button = document.createElement('button');
    button.dataset.id = counterProjects;
    button.innerText = userInput;
    button.classList.add('mouseOverOut')
    button.classList.add(`js-multiple-list`)
    button.classList.add('selected-project')

    let span = document.createElement('span');
    span.innerText = 'X';
    span.classList.add('projectHide')
    span.classList.add('jsRemoveProject')
    button.appendChild(span);
    divMultipleTodoLists.prepend(button);
    multipleTodoLists.forEach(x => x.selected = false);
    const index = multipleTodoLists.findIndex(object => object.name === userInput)
    multipleTodoLists[index]['selected'] = true;
    toDoStorage = getArrayTasksFromMultipleProject() || [];
    update();
  }
}


document.querySelector('.add-project')
  .addEventListener('click', (event) => {
    addProject();
    localStorage.setItem('multipleTodoLists', JSON.stringify(multipleTodoLists));
  });


function removeSelectProject() {
  const allMultipleButtons = document.querySelectorAll('.js-multiple-list')
  allMultipleButtons.forEach((item) => {
    item.classList.remove('selected-project')
  })
  multipleTodoLists.forEach(x => x.selected = false);
  localStorage.setItem('multipleTodoLists', JSON.stringify(multipleTodoLists));
}


function getMaxid(array) {
  let maxValue = 0;
  for (const i in array) {
    if (array[i].id > maxValue) {
      maxValue = array[i].id
    }
  }
  return maxValue;
};


let uniqueNumber = getMaxid(toDoStorage);

update();


function addTask() {
  let nameElemet = document.querySelector('.js-fourth-practice-input').value;
  let dateElement = document.getElementById('js-date').value;
  const projectIndex = multipleTodoLists.findIndex(element => element.selected === true);
  let items = {
    toDoName: nameElemet,
    date: dateElement,
    html: '',
    id: uniqueNumber += 1,
    isDone: '',
  };

  if (items.toDoName) {
    toDoStorage.push(items);
    multipleTodoLists[projectIndex]['tasks'] = toDoStorage
    let objectUniqNumber = items.id;
    let index = findIndexInArray(toDoStorage, objectUniqNumber);
    move(index, true);
  } else {
    return;
  }

  update();
  resetForm();
};


function update() {
  const whereElenemt = document.querySelector('.js-todo-list-4');
  let html = ''

  for (const i in toDoStorage) {

    if (toDoStorage[i].html) {

      if (toDoStorage[i].isDone) {
        let parser = new DOMParser();
        let parsedDocument = parser.parseFromString(toDoStorage[i].html, "text/html");
        parsedDocument.body.firstChild.firstChild.defaultChecked = true;
        parsedDocument.body.firstChild.childNodes[1].classList.add('done-tusk');
        toDoStorage[i].html = parsedDocument.body.firstChild.outerHTML;
      } else if (!toDoStorage[i].isDone) {
        let parser = new DOMParser();
        let parsedDocument = parser.parseFromString(toDoStorage[i].html, "text/html");
        parsedDocument.body.firstChild.firstChild.defaultChecked = false;
        parsedDocument.body.firstChild.childNodes[1].classList.remove('done-tusk');
        toDoStorage[i].html = parsedDocument.body.firstChild.outerHTML;
      }

      html += toDoStorage[i].html;

    } else {
      let myDiv = document.createElement('div');
      myDiv.classList.add('js-todo-row-with-check');
      myDiv.dataset.firstindex = toDoStorage[i].id;

      let checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.classList.add('js-checkbox')
      // checkbox.defaultChecked = true;

      myDiv.appendChild(checkbox);

      let nameDiv = document.createElement('div');
      nameDiv.classList.add('js-nameDiv');
      nameDiv.innerHTML = toDoStorage[i].toDoName;

      myDiv.appendChild(nameDiv);

      let dateDiv = document.createElement('div');
      dateDiv.classList.add('js-date-output');
      dateDiv.innerHTML = toDoStorage[i].date.split('-').reverse().join('-');
      myDiv.appendChild(dateDiv);

      let button = document.createElement('button');
      button.innerHTML = 'Delete';
      button.classList.add('remove-button');
      button.classList.add('js-delete-button');
      button.dataset.index = toDoStorage[i].id;

      myDiv.appendChild(button);

      toDoStorage[i].html = myDiv.outerHTML;

      html += toDoStorage[i].html;
    }
  }
  whereElenemt.innerHTML = html;
  localStorage.setItem('multipleTodoLists', JSON.stringify(multipleTodoLists));
}


function clearStorage() {
  toDoStorage = []
  uniqueNumber = 0
  const outPut = document.querySelector('.js-todo-list-4')
  outPut.innerHTML = '';
  resetForm();
  multipleTodoLists = [];
  localStorage.removeItem('multipleTodoLists')
  localStorage.clear();
  const allMultipleButtons = document.querySelectorAll('.js-multiple-list')
  allMultipleButtons.forEach((item) => {
    if (!item.classList.contains('js-inbox')) {
      item.remove();
    }
  });
  addZeroProject();
  selectInboxProject();
  counterProjects = 0;
  inboxButton.dataset.id = 0;
};


function findIndexInArray(array, uniqNum) {
  const index = array.findIndex(object => object.id === uniqNum)
  return index;
}


function removeToDo(uniqNum) {
  const index = findIndexInArray(toDoStorage, uniqNum)
  toDoStorage.splice(index, 1);
  update();
}


function resetForm() {
  document.querySelector('.js-fourth-practice-input').value = '';
  document.querySelector('.js-date-input').value = '';
}


function addToDoItemEnter(event) {
  if (event.keyCode === 13) {
    addTask();
  } else if (event.keyCode === 27) {
    resetForm();
  }
}


document.querySelector('.js-todo-list-4')
  .addEventListener("click", (event) => {
    if (event.target.tagName != 'BUTTON') {
      return;
    }
    removeToDo(Number(event.target.dataset['index']));
  });

document.querySelector('.js-clear-storage')
  .addEventListener('click', clearStorage);

document.querySelector('.js-add-task-button')
  .addEventListener('click', addTask);

document.querySelector('.js-todo-row')
  .addEventListener('keydown', (event) => {
    addToDoItemEnter(event);
  });


function moveElementInArray(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    let i = newIndex - arr.length + 1;
    while (i--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
};


function move(index, flag) {
  const indexDoneTask = [].sort();
  const indexNotDoneTask = [].sort();

  toDoStorage.forEach((el, i) => {
    if (el.isDone === true)
      indexDoneTask.push(i);
  })
  toDoStorage.forEach((el, ii) => {
    if (el.isDone === false || el.isDone === '')
      indexNotDoneTask.push(ii);
  })

  let to = toDoStorage.length;

  if (indexDoneTask.length === 0) {
    to = to - 1;
  } else if (flag === true) {
    to = to - indexDoneTask.length - 1;
  } else if (indexDoneTask) {
    to = to - indexDoneTask.length;
  }
  moveElementInArray(toDoStorage, index, to);
};


allCheckbox = document.querySelector('.js-todo-list-4')
  .addEventListener('change', (event) => {
    let objectUniqNumber = Number(event.target.parentElement.dataset['firstindex']);
    let index = findIndexInArray(toDoStorage, objectUniqNumber);

    if (event.target.checked) {
      toDoStorage[index].isDone = true;
      localStorage.setItem('multipleTodoLists', JSON.stringify(toDoStorage));
      move(index);
      update();

    } else {
      toDoStorage[index].isDone = false;
      localStorage.setItem('multipleTodoLists', JSON.stringify(toDoStorage))
      move(index, true);
      update();
    };
  });


inboxButton.addEventListener('click', () => {
  toDoStorage = getArrayTasksFromMultipleProject() || [];
  update();
})



const divWithButton = document.querySelector('.js-multiple-todo-lists');
divWithButton.addEventListener('mouseover', (event) => {
  toogleXclassButton(event);
})

divWithButton.addEventListener('mouseout', (event) => {
  toogleXclassButton(event);
})


function toogleXclassButton(event) {
  if (event.target.lastChild.tagName == 'SPAN') {
    event.target.lastChild.classList.toggle('projectInline');
    event.target.lastChild.classList.toggle('projectHide');
  }
  if (event.target.classList.contains('jsRemoveProject')) {
    event.target.classList.toggle('projectInline');
    event.target.classList.toggle('projectHide');
  }
}


function selectInboxProject() {
  if (!inboxButton.classList.contains('selected-project')) {
    inboxButton.classList.add('selected-project')
    const index = multipleTodoLists.findIndex(object => object.prime == true)
    multipleTodoLists[index].selected = true;
  }
}


const wrapperForDeleteProjectButton = document.querySelector('.js-multiple-todo-lists');

wrapperForDeleteProjectButton.addEventListener('click', (event) => {
  let wrapperRemoveButton = event.target;
  if (wrapperRemoveButton.classList?.contains('jsRemoveProject')) { // optional chaining избавляет от undefined когда тапаешь по добавить проект
    const id = wrapperRemoveButton.parentElement.dataset['id']
    const index = multipleTodoLists.findIndex(object => object.id == id)
    if (multipleTodoLists[index].selected == true) {
      selectInboxProject();
    }
    multipleTodoLists.splice(index, 1);
    divMultipleTodoLists.removeChild(wrapperRemoveButton.parentElement);
    localStorage.setItem('multipleTodoLists', JSON.stringify(multipleTodoLists));
    toDoStorage = getArrayTasksFromMultipleProject() || [];
    update();
  }
})


const wrapperAllMultipleButtons = document.querySelector('.all-projects');
const allMultipleButtons = document.getElementsByClassName('js-multiple-list');

wrapperAllMultipleButtons.addEventListener('click', (event) => {
  if (event.target?.classList.contains('js-multiple-list')) {
    for (let i = 0; i < allMultipleButtons.length; i++) {
      allMultipleButtons[i].classList.remove('selected-project')
    }
    event.target.classList.add('selected-project')
    multipleTodoLists.forEach(x => x.selected = false);

    const index = multipleTodoLists.findIndex(object => object.id == event.target.dataset['id'])
    if (index !== -1) {
      multipleTodoLists[index]['selected'] = true;
    } else {
      console.log('че то не хватает');
    }
    localStorage.setItem('multipleTodoLists', JSON.stringify(multipleTodoLists));
    toDoStorage = getArrayTasksFromMultipleProject() || [];
    update();
  }
})
