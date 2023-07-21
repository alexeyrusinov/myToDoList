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
    isDone: false,
  }

  if (items.toDoName) {
    toDoStorage.push(items);
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
      // console.log(typeof toDoStorage[i].html);
      // console.log(toDoStorage[i].html);

      if (toDoStorage[i].isDone) {
        console.log('true');
        let parser = new DOMParser();
        let parsedDocument = parser.parseFromString(toDoStorage[i].html, "text/html");
        parsedDocument.body.firstChild.firstChild.defaultChecked = true;
        parsedDocument.body.firstChild.childNodes[1].classList.add('done-tusk');
        toDoStorage[i].html = parsedDocument.body.firstChild.outerHTML;
        // console.log(typeof parsedDocument.body.firstChild.outerHTML);
        // console.log(parsedDocument.body.firstChild.outerHTML);
      }

        // console.log(parsedDocument.body.firstChild.firstChild.value);
        // parsedDocument.body.firstChild.firstChild.checked = true;

        // console.log(parsedDocument.body.firstChild.outerHTML);

      // }

      html += toDoStorage[i].html;

    } else {
      // toDoStorage[i].html = `
      // <div class="js-todo-row-with-check" data-firstindex="${toDoStorage[i].id}">
      //   <input type="checkbox" class="js-checkbox">
      //   <div>${toDoStorage[i].toDoName}</div>
      //   <div class="js-date-output">${toDoStorage[i].date.split('-').reverse().join('-')}</div>
      //   <button data-index="${toDoStorage[i].id}" class="remove-button js-delete-button">Delete</button>
      // </div>`


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
      // console.log(toDoStorage[i].date);
      // dateDiv.innerHTML = toDoStorage[i].date.split('-').reverse().join('-');
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

  // if (allCheckbox) {
  // addListenerForCheckbox();
  // }
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


// const allCheckbox = document.querySelectorAll('.js-checkbox')
// const arrayAllCheckbox = Array.from(allCheckbox);;

// arrayAllCheckbox.forEach((item) => {
//   item.addEventListener('click', (event) => {
//     console.log(ivent.target);
//   });
// })


// const allCheckbox = [...document.querySelectorAll('.js-checkbox')];

// allCheckbox.forEach((item) => {
//   item.addEventListener('change', (event) => {
//     if (event.target.checked) {
//       console.log('зачеркиваем таск');
//       console.log(event.target);
//       console.log(event.currentTarget);
//     } else {
//       console.log('не зачеркиваем тaск');
//       console.log(event.target);
//     }
//   });
// })


// // function addListenerForCheckbox() {
//   allCheckbox = [...document.querySelectorAll('.js-todo-row-with-check')];
//   allCheckbox.forEach((item) => {
//     item.addEventListener('change', (event) => {
//       if (event.target.checked) {
//         console.log(event.target);
//         console.log(event.currentTarget);
//         event.currentTarget.classList.add('done-tusk');
//       } else {
//         console.log(event.target);
//         console.log(event.currentTarget);
//         event.currentTarget.classList.remove('done-tusk');
//       };
//     });
//   });
// // };

function moveElemet(array, from, to) {
  // еще добавить проверку чтобы не двигать элемент если он последний
  let temp = array[from];
  let i;
  for (i = from; i >= to; i--) {
    array[i] = array[i - 1];
  }
  array[to] = temp;
};

// let arr = [1, 2, 3, 4]
// console.log(arr);
// // console.log(moveElemet(arr, 3, 0));
// console.log(arr);

// // закидывает в конец массива элемент
// arr.push(arr.splice(1, 1)[0]);
// // arr.push(arr.splice(arr.indexOf(2), 1)[0]);
// console.log(arr);


allCheckbox = document.querySelector('.js-todo-list-4')
  .addEventListener('change', (event) => {
    if (event.target.checked) {
      // console.log(event.target.nextElementSibling.classList.add('done-tusk'));
      // event.target.nextElementSibling.classList.add('done-tusk');
      toDoStorage[event.target.parentElement.dataset['firstindex'] - 1].isDone = true;
      // console.log(event.target.parentElement.dataset['firstindex']);
      // console.log(event.target);
      // event.target.defaultChecked = true
      // console.log(event.target);
      // checked="checked"
      localStorage.setItem('items', JSON.stringify(toDoStorage));
      update();

      // вот это должно двигать в конец
      // toDoStorage.push(toDoStorage.splice(event.target.parentElement.dataset['firstindex'] - 1, 1)[0]);


      // console.log(event.target.parentElement.outerHTML);
      // toDoStorage[event.target.parentElement.dataset['firstindex'] - 1].html = event.target.parentElement.outerHTML;

      // console.log(event.currentTarget.dataset['firstindex']);

      // console.log(event.currentTarget);
      // event.target.classList.add('done-tusk');
    } else {
      // console.log(event);
      // console.log(event.target.nextElementSibling.classList.remove('done-tusk'));
      event.target.nextElementSibling.classList.remove('done-tusk');
      toDoStorage[event.target.parentElement.dataset['firstindex'] - 1].isDone = false;
      localStorage.setItem('items', JSON.stringify(toDoStorage));
      update();
      // console.log(event.target.nextElementSibling);
      // console.log(event.currentTarget);
      // event.target.classList.remove('done-tusk');
    };
  });


  // const myDiv = document.createElement('div');
  // myDiv.classList.add('js-todo-row-with-check');
  // myDiv.dataset.firstindex = toDoStorage[i].id;

  // console.log(myDiv);

//   <div class="js-todo-row-with-check" data-firstindex="${toDoStorage[i].id}"> +
//   <input type="checkbox" class="js-checkbox">
//   <div>${toDoStorage[i].toDoName}</div>
//   <div class="js-date-output">${toDoStorage[i].date.split('-').reverse().join('-')}</div>
//   <button data-index="${toDoStorage[i].id}" class="remove-button js-delete-button">Delete</button>
// </div>`

// const myDiv = document.createElement('div');
// myDiv.classList.add('js-todo-row-with-check');
// myDiv.dataset.firstindex = 1;

// const checkbox = document.createElement('input');
// checkbox.type = "checkbox";
// checkbox.classList.add('js-checkbox')

// myDiv.appendChild(checkbox);

// const nameDiv =  document.createElement('div');
// nameDiv.classList.add('js-nameDiv');

// myDiv.appendChild(nameDiv);

// const dateDiv = document.createElement('div');
// myDiv.appendChild(dateDiv);

// const button = document.createElement('button');
// button.innerHTML = 'Delete';
// button.classList.add('remove-button');
// button.classList.add('js-delete-button');
// button.dataset.index = 1;

// myDiv.appendChild(button);

// document.querySelector('.js-todo-list-4').appendChild(myDiv);

// console.log(myDiv);