// достаем из памяти строку и преобразовываем массив с обьектавми внутри
const todoItems = JSON.parse(localStorage.getItem('items'));
let toDoStorage = [];
let allCheckbox;

// закидываем из памяти в
if (todoItems !== null) {
  todoItems.forEach(object => toDoStorage.push(object))
}

function getMaxid() {
  let maxValue = 0;

  for (const i in toDoStorage) {
    if (toDoStorage[i].id > maxValue) {
      maxValue = toDoStorage[i].id
    }
  }
  return maxValue;
}

let uniqueNumber = getMaxid();

update();

function addToDoItem() {
  let nameElemet = document.querySelector('.js-fourth-practice-input').value;
  let dateElement = document.getElementById('js-date').value;
  let items = {
    toDoName: nameElemet,
    date: dateElement,
    html: '',
    id: uniqueNumber += 1,
    isDone: '',
  }

  if (items.toDoName) {
    toDoStorage.push(items);
    let objectUniqNumber = items.id;
    let index = findIndexInArray(toDoStorage, objectUniqNumber);
    move(index, true);
  } else {
    return;
  }

  update();
  resetForm();
}

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

      let nameDiv =  document.createElement('div');
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
  localStorage.setItem('items', JSON.stringify(toDoStorage));
}

function clearStorage() {
  localStorage.removeItem('items');
  localStorage.clear;
  toDoStorage = []
  uniqueNumber = 0
  const outPut = document.querySelector('.js-todo-list-4')
  outPut.innerHTML = ''
  resetForm();
}

function removeToDo(uniqNum) {
  // ----------------------- сюда добавить функцию findIndexInArray
  index = toDoStorage.findIndex(object => object.id === uniqNum)
  console.log(toDoStorage[index].toDoName + ' - deleted');

  toDoStorage.splice(index, 1);

  update();
}

function resetForm() {
  document.querySelector('.js-fourth-practice-input').value = '';
  document.querySelector('.js-date-input').value = '';
}

function addToDoItemEnter(event) {
  if (event.keyCode === 13) {
    addToDoItem();
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
  .addEventListener('click', addToDoItem);

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


function findIndexInArray(array, uniqNum) {
  const index = array.findIndex(object => object.id === uniqNum)
  return index;
}


allCheckbox = document.querySelector('.js-todo-list-4')
  .addEventListener('change', (event) => {
    let objectUniqNumber = Number(event.target.parentElement.dataset['firstindex']);
    let index = findIndexInArray(toDoStorage, objectUniqNumber);

    if (event.target.checked) {
      toDoStorage[index].isDone = true;
      localStorage.setItem('items', JSON.stringify(toDoStorage));
      move(index);
      update();

    } else {
      toDoStorage[index].isDone = false;
      localStorage.setItem('items', JSON.stringify(toDoStorage))
      move(index, true);
      update();
    };
  });


