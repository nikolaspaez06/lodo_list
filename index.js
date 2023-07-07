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
// mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true})

app.get("/",(req, res) => {
    Todo.find()
    .then(result =>{
        res.render('index', {data: result})
        console.log(result)
    })
})
////
app.get("/:id", (req, res) => {
    const todoId = req.params.id;
    Todo.findById(todoId)
    .then(todo => {
        if (!todo) {
        res.status(404).send('Documento no encontrado.');
        return;
        }

        res.render('update', { todo });
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error al buscar el documento.');
    });
});

////
app.post("/",(req,res) => {
    const todo = new Todo({
        todo: req.body.todoValue

})
todo.save()
.then(result =>{
    res.redirect("/")
})
})


app.post("/:id", (req, res) => {
    const todoId = req.params.id;
    const updatedTodo = req.body.todoValue;

    Todo.findByIdAndUpdate({ _id: todoId }, { todo: updatedTodo })
    .then(() => {
        res.redirect("/");
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error al actualizar la información.');
    });
});


///

app.patch('/:id', (req, res) => {
    const todoId = req.params.id
    const todoValue = req.body.todoValue

    Todo.updateOne({ _id: todoId }, { todo: todoValue })
    .then(() => {
        res.redirect(`/update/${todoId}`);
    })
    .catch(error => {
        // Manejo de errores
        console.error(error);
        res.status(500).send('Error al actualizar la información.');
    })
})

app.delete('/:id',(req,res)=>{
    Todo.findByIdAndDelete(req.params.id)
    .then(result =>{
        console.log(result)
    })
})

app.listen(port,() => {
    console.log("Port: " + port)
})
