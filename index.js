const http = require('http')
const express = require('express')
const cors = require('cors');
const app = express();
app.use(express.json())
let persons=
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.use(cors())
app.use(express.static('dist'))
app.get('/',(req,res)=>{
  
    res.status(204).end()
})
app.get('/api/persons',(req,res)=>{
    res.json(persons);
})
app.get('/api/info',(req,res)=>{
    const length1 = persons.length;
    let s1 = `Phone has the info of ${length1} peoples`
    const d = new Date;
    let s2 = d.toUTCString();
    
    res.send(`<div>
       <p> ${s1} <p/>
       <div>${new Date()}<div/>
       <div/>`);
})

app.get('/api/persons/:id',(req,res)=>{
    const id = req.params.id;
    const information = persons.find(person=>person.id===id);
    
    if(information)
    {   console.log(information)
        res.status(200).send(information);
    }else{
        res.status(404).send("url does not exist");
    }
   
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = req.params.id;
    let found = persons.findIndex((element) => element.id === id);
    const body = persons[found];
    persons = persons.filter(person=>person.id!=id);
    res.status(200).json(body); 
})
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
  const checkUnique =(name)=>{
    
    const found = persons.findIndex(person=>person.name===name);
    console.log(found)
    if(found===-1) return true;

    return false;
  }
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.number || !body.name) {
      return response.status(400).json({ 
        error: 'name or number is missing' 
      })
    }
    
    if(!checkUnique(body.name)){
        return response.json({
          error:  "name is already in phonebook"
        })
    }
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  app.put('/api/persons/:id',(req,res)=>{
    const id = req.params.id;
    const body = req.body;
    let found = persons.findIndex((element) => element.id === id);
    persons[found].number = body.number;
    res.send(204);
  })
  
const PORT = process.env.PORT || 3001;

app.listen(PORT)
console.log(`Server running on port ${PORT}`)
