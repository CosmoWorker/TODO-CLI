const fs=require("fs").promises

const { Command }= require("commander")
const program= new  Command()

const ToDoFile="todo_cli.json"

const loadTodo=async()=>{
  try{
    const data=await fs.readFile((ToDoFile), "utf-8")
    return JSON.parse(data)
  }
  catch(err){
    if (err.code==="ENOENT"){
      return []
    }
    else{
      console.error(err)
    }
  }
}

const saveToDo=async(todo)=>{
  try{
    await fs.writeFile(ToDoFile, JSON.stringify(todo, 2),"utf-8")
  }catch(err){
    console.error(err)
  }
}

program
  .name("To-Do List")
  .description("CLI to manage your To-Do List")
  .version("0.8.0")

program.command("add")
  .description("To Add a new task")
  .argument("<task...>", "The task description")
  .action(async (task)=>{
    const addTask=await loadTodo(task)
    taskDesc=task.join(' ').trim()
    addTask.push({task: taskDesc, done:false})
    await saveToDo(addTask)
    console.log(`Task Added : ${taskDesc}`)
  })

program.command("done")
  .description("Mark as done for the task")
  .argument("<index>", "index for mark as done")
  .action(async (index)=>{
    const doneTask=await loadTodo()
    index=parseInt(index, 10)
    if (index < 0 || index > doneTask.length){
      console.log(`Invalid index ${index}`)
    }
    else{
      doneTask[index].done=true
      await saveToDo(doneTask)
      console.log(`Task Done: ${doneTask[index].task}`)
    }
  })

  program.command("delete")
  .description("To Delete a task")
  .argument("<index>","index for deleting task")
  .action(async(index)=>{
    const deleteTask=await loadTodo()
    index=parseInt(index, 10)
    if (index < 0 || index >= deleteTask.length){
      console.log(`Invalid index ${index}`)
    }
    else{
      const deletedTask=deleteTask.splice(index, 1)
      await saveToDo(deleteTask)
      console.log(`Task Deleted: ${deletedTask[0].task}`)
    }
  })

program.command("list")
  .description("To List all Tasks")
  .action(async()=>{
    const listTasks=await loadTodo()
    if (listTasks.length===0){
      console.log("No Tasks found")
    }
    else{
      listTasks.forEach((task, index)=>{
          console.log(`${index}.  ${task.task} - ${task.done}`)
      })
    }
  })


program.parse(process.argv)