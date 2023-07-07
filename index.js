const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Todo = require("./models/todo")
const { render } = require('ejs')
const todo = require('./models/todo')


const port = 3000


require('dotenv').config()
const app = express()

// Html y Css
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// ConectMongo
const dburl = "mongodb://localhost:27017/tododb"
mongoose.connect(process.env.MONGO_DB_URI)

//Get page
app.get("/",(req, res) => {
    Todo.find()
    .then(result =>{
        res.render('index', {data: result})
        console.log(result)
    })
})

// Get for ID List
app.get("/:id", (req, res) => {
    const todoId = req.params.id;
    Todo.findById(todoId)
    .then(todo => {
        if (!todo) {
        res.status(404).send('Tarea no encontrado.');
        return;
        }

        res.render('update', { todo });
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error al buscar la tarea.');
    });
});

//// Create List
app.post("/",(req,res) => {
    const todoId = new Todo({
        todo: req.body.todoValue

})
todoId.save()
.then(result =>{
    res.redirect("/")
})
})

// post by id to update List the information entered in patch
app.post("/:id", (req, res) => {
    const todoId = req.params.id;
    const todoValue = req.body.todoValue;

    Todo.findByIdAndUpdate(todoId, { todo: todoValue }, { new: true })
    .then(updatedTodo => {
        if (!updatedTodo) {
        res.status(404).send('Tarea no encontrado.');
        return;
        }
        
        console.log(updatedTodo);
        res.redirect('/');
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error al actualizar la Tarea.');
    });
});

//Update List
app.patch('/:id', (req, res) => {
    const todoId = req.params.id;
    const todoValue = req.body.todoValue;

    Todo.findByIdAndUpdate(todoId, { todo: todoValue }, { new: true })
    .then(updatedTodo => {
        if (!updatedTodo) {
        res.status(404).send('Tarea no encontrado.');
        return;
        }
        
        console.log(updatedTodo);
        res.redirect('/');
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error al actualizar la Tarea.');
    });
});

// Delete List
app.delete('/:id',(req,res)=>{
    Todo.findByIdAndDelete(req.params.id)
    .then(result =>{
        console.log(result)
    })
})

app.listen(port,() => {
    console.log("Port: " + port)
})