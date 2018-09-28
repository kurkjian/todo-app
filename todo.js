var removedItems = [];
var currentTodo = "";
var newElement = {};

window.onload = function()
{
  goto('login');
}

function goto(id) {
  removedItems = [];
  var pages = document.getElementsByClassName("page");
  for(var i = 0; i < pages.length; i++)
  {
    pages[i].style.display = "none";
  }
  var page;
  if(id == "login")
    page = document.getElementById('login');
  else
    page = document.getElementById('list');

  if(id != "login")
  {
    page.childNodes[1].innerHTML = id + "\'s todo list";
  }

  page.style.display = "block";
  currentTodo = id;
  clearText();
  if(window.localStorage.getItem(id) != null)
  {
    loadTodo(id);
  }
}

function clearText()
{
  var lists = document.getElementsByClassName("todo-list")
  for(var i = 0; i < lists.length; i++)
  {
    var list = lists[i];
    for(var j = 0; j < list.childNodes.length; j++)
    {
      list.removeChild(list.childNodes[j]);
    }
  }
}

function addItem(button) {
  var day = button.parentNode.parentNode.childNodes[1].innerHTML;
  var list = button.parentNode.parentNode.childNodes[3];
  if(newElement.field && newElement.day == day)
  {
    return;
  }
  else if(newElement.day)
  {
    newElement.todoList.removeChild(newElement.field);
    newElement.todoList.removeChild(newElement.conf);
    newElement.todoList.removeChild(newElement.dele);
  }
  var input = document.createElement("input");
  input.id = "newtodo"
  var confirm = document.createElement("button");
  confirm.appendChild(document.createTextNode("✓"));
  confirm.onclick = function(){commitTodo(document.getElementById("newtodo").value, this.parentNode, false);};
  var del = document.createElement("button");
  del.appendChild(document.createTextNode("X"));

  input.style.color = "black";
  input.style.width = "62.5%";

  input.className = "grow";
  confirm.className = "grow";
  del.className = "grow";

  list.appendChild(input);
  list.appendChild(confirm);
  list.appendChild(del);
  input.focus();
  newElement = {field: input, conf: confirm, dele: del, day: button.parentNode.childNodes[1].innerHTML, todoList: list};
}

function commitTodo(value, list, fromStorage)
{
  var li = document.createElement("li");
  var span = document.createElement("span");
  span.appendChild(document.createTextNode(value));
  span.childNodes[0].className = "grow";
  span.className = "grow text";
  li.appendChild(span);
  var upbutton = document.createElement("button");
  upbutton.onclick = function() {moveUp(this);};
  upbutton.className = "grow";
  var downbutton = document.createElement("button");
  downbutton.onclick = function() {moveDown(this);};
  downbutton.className = "grow";
  var i = document.createElement("i");
  i.className = "fas fa-chevron-up";
  upbutton.appendChild(i);
  var i2 = document.createElement("i");
  i2.className = "fas fa-chevron-down";
  downbutton.appendChild(i2);
  var markdone = document.createElement("button");
  markdone.onclick = function(){markDone(this);};
  markdone.appendChild(document.createTextNode("✓"));
  markdone.className = "grow";
  var del = document.createElement("button");
  del.onclick = function(){deleteItem(this);};
  del.appendChild(document.createTextNode("X"));
  del.className = "grow";


  if(!fromStorage)
  {
    var index = list.childNodes.length - 3;
    list.removeChild(list.childNodes[index]);
    list.removeChild(list.childNodes[index]);
    list.removeChild(list.childNodes[index]);
    var day = list.parentNode.childNodes[1].childNodes[1].innerHTML;
    updateStorage(day, value);
  }
  li.appendChild(upbutton);
  li.appendChild(downbutton);
  li.appendChild(markdone);
  li.appendChild(del);
  list.appendChild(li);
  newElement = {};
}

function moveUp(sender)
{
  var li = sender.parentNode;
  var list = li.parentNode;
  var child = sender.parentNode;
  var index = 0;
  while( (child = child.previousSibling) != null )
  {
    index++;
  }
  if(index < 1)
  {
    return;
  }
  li.parentNode.insertBefore(li, list.childNodes[index-1]);

  organizeStorage();
}

function moveDown(sender)
{
  var li = sender.parentNode;
  var list = li.parentNode;
  var child = sender.parentNode;
  var index = 0;
  while( (child = child.previousSibling) != null )
  {
    index++;
  }
  if(index < list.childNodes.length - 1)
  {
    list.insertBefore(list.childNodes[index + 1], li);
  }

  organizeStorage();
}

function markDone(sender)
{
  if(sender.innerHTML == "-")
  {
    var text = sender.parentNode.childNodes[0];
    text.style.textDecoration = "none";
    text.style.color = "white";
    sender.innerHTML = "✓";
    return;
  }
  var text = sender.parentNode.childNodes[0];
  text.style.textDecoration = "line-through";
  text.style.color = "red";
  sender.innerHTML = "-";
}

function deleteItem(sender)
{
  var li = sender.parentNode;
  var mark = li.childNodes[3];
  var list = li.parentNode;
  var child = sender.parentNode;
  var index = 0;
  while((child = child.previousSibling) != null)
  {
    index++;
  }
  var deletedItem = {listItem: li, day: list.parentNode.childNodes[1], dayList: list.parentNode, listIndex: index, markDone: false};
  if(mark.innerHTML == "-")
  {
    deletedItem.markDone = true;
  }
  removedItems.push(deletedItem);
  list.removeChild(li);
  organizeStorage();
}

function undo()
{
  var lastItem = removedItems.pop();
  if(!lastItem)
  {
    return;
  }
  var daylist;
  var list = document.getElementsByClassName("list")[0];
  for(var i = 0; i < list.childNodes.length; i++)
  {
    daylist = list.childNodes[i];
    if(daylist == lastItem.dayList)
    {
      break;
    }
  }
  var todoList = daylist.childNodes[3];
  if(todoList.childNodes.length < 1 || todoList.childNodes.length < lastItem.listIndex)
  {
    todoList.appendChild(lastItem.listItem);
  }
  else
  {
    todoList.insertBefore(lastItem.listItem, todoList.childNodes[lastItem.listIndex]);
  }
  organizeStorage();
}

function organizeStorage()
{
  if(!(window.localStorage.getItem(currentTodo) === null))
  {
    var mainList = document.getElementsByClassName("list")[0];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var storage = [];
    for(var i = 0; i < 7; i++)
    {
      var obj = {};
      storage[i] = {day: days[i], todos: []};
      var todoList = mainList.childNodes[2*i + 1].childNodes[3];
      for(var j = 0; j < todoList.childNodes.length; j++)
      {
        storage[i].todos.push(todoList.childNodes[j].childNodes[0].innerHTML);
      }
    }
    window.localStorage.setItem(currentTodo, JSON.stringify(storage));
  }
}

function updateStorage(day, value)
{
  if(window.localStorage.getItem(currentTodo) === null)
  {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var storage = [];
    for(var i = 0; i < days.length; i++)
    {
      storage[i] = {day: days[i], todos: []};

      if(days[i] == day)
      {
        storage[i].todos.push(value);
      }
    }
    window.localStorage.setItem(currentTodo, JSON.stringify(storage));
  }
  else
  {
    var storage = JSON.parse(window.localStorage.getItem(currentTodo));
    for(var i = 0; i < 7; i++)
    {
      var testDay = storage[i].day;
      if(testDay == day)
      {
        storage[i].todos.push(value);
      }
    }

    window.localStorage.setItem(currentTodo, JSON.stringify(storage));
  }
}

function loadTodo(id)
{
  var storage = JSON.parse(window.localStorage.getItem(currentTodo));
  var mainList = document.getElementsByClassName("list")[0];
  for(var i = 0; i < 7; i++)
  {
    var obj = storage[i];
    var dayList = mainList.childNodes[2*i + 1];
    var todos = obj.todos;
    for(var j = 0; j < todos.length; j++)
    {
      commitTodo(todos[j], dayList.childNodes[3], true);
    }
  }
}
