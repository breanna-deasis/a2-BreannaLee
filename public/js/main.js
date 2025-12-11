// FRONT-END (CLIENT) JAVASCRIPT HERE

/*const update = async function(event) {
  const response = await fetch( "/submit", {
    method:"PATCH",
    body 
  })
}*/

const addTaskButton = document.getElementById("add-task"),
        taskInput = document.getElementById("task-input"),
        dueDateInput = document.getElementById("due-date-input");
        priorityList = document.getElementById("priority-tasks");
        taskList = document.getElementById("task-list");
        completedList = document.getElementById("completed-tasks");
        overdueTitle = document.getElementById("overdue-header");
        otherTitle = document.getElementById("other-header");

//ADDS A NEW TASK
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();
  const task = taskInput.value.trim();
  if (!task) return;
  const dueDate = dueDateInput.value || new Date().toISOString().split("T")[0];

  
  //const body = JSON.stringify({task: text, completed: false, dueDate});

  const response = await fetch( "/tasks", {
    method:"POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({task, completed:false, dueDate})
  });//.then(function(response) {return response.json();})
  //.then(function(json) {

  const updatedTasks = await response.json();
  printTasks(updatedTasks);
  taskInput.value = "";
  dueDateInput.value = "";
}

const printTasks = (tasks) => {
  taskList.innerHTML = "";
  completedList.innerHTML = "";
  priorityList.innerHTML = "";
  overdueTitle.innerHTML= "";
  otherTitle.innerHTML= "";

  tasks.forEach( item => {
    const li = document.createElement('li');

    //checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    checkbox.addEventListener('change', () => {
      item.completed = checkbox.checked;
      span.classList.toggle('completed', checkbox.checked);
      if (item.completed) completedList.appendChild(li);
      else taskList.appendChild(li);
      toggleTask(item.task, checkbox.checked);
    });
    
    // task name (editable)
    const span = document.createElement('span');
    span.innerText = item.task;
    span.contentEditable = true;
    span.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        await fetch('/tasks', {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({originalTask: item.task, newTask: span.innerText })
        });
        loadTasks();
      }
    });

    const dueDateText = document.createElement('small');
    const d = new Date();
    const formattedDate = `${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}-${d.getFullYear()}`;
    const dueDate = dueDateInput.value || formattedDate;

    dueDateText.innerText = item.dueDate || formattedDate;//`Due: ${item.dueDate}`;
    dueDateText.contentEditable = true;
    //span.appendChild(document.createElement('br'));
    //span.appendChild(dueDateText);

    dueDateText.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter'){
        e.preventDefault();
        //const newDate = dueDateText.innerText.replace('Due: ', '').trim();
        //item.dueDate = newDate;
        await fetch('/tasks', {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({task: item.task, dueDate: dueDateText.innerText })
        });
        loadTasks();
      }
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener('click', async() => {
      await fetch(`/tasks/${encodeURIComponent(item.task)}`,{ method: 'DELETE'});
      li.remove();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(document.createElement("br"));
    li.appendChild(dueDateText);
    li.appendChild(deleteButton);


    if (item.completed) {
      completedList.appendChild(li);
    } else  if (item.overdue) {
      overdueTitle.innerHTML="OVERDUE TASKS!!";
      otherTitle.innerHTML="Things to work on later..";
      priorityList.appendChild(li);
    } else {
      taskList.appendChild(li);
    }
  });
};

const toggleTask = async (taskName, isCompleted) => {
  await fetch('/tasks', {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ task: taskName, completed: isCompleted})
  });
  //span.classList.toggle('completed', checkbox.checked);
  //item.completed = checkbox.checked;
  loadTasks();
  //printTasks(await (await fetch('/tasks')).json());
};

const loadTasks = async ()=> {
  const response = await fetch("/tasks");
  const tasks = await response.json();
  printTasks(tasks);
}

window.onload = loadTasks;

addTaskButton.addEventListener('click', submit);
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    submit(event);
  }
});
