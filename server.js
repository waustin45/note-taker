const express = require('express')
const path =  require('path')
const PORT = 3001
const app = express()
const data = require('./db/db.json')
const fs = require('fs')
let dataArray = data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
    
  });
  app.get('/api/notes', (req, res) => {
    res.json(data)
  });
  app.post('/api/notes', (req, res) => {
   const { title, text, id} = req.body
   
    
    if (req.body && req.body.title) {
        const newNote = {
            title, 
            text,
            id
        }
        const noteString = JSON.stringify(newNote)
        const dataString = [JSON.stringify(data)].push(noteString)
         data.push(newNote)
        
        
        fs.writeFile("./db/db.json", JSON.stringify(data),  (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("written successfully")
            }
        })
        // console.log(newNote)
        // data.push(newNote)
       
        console.log(`${JSON.stringify(newNote)} has been pushed to data: ${JSON.stringify(data)}`)
        return
    } else {console.log("error")}
  });
  app.delete('/api/notes/:id', (req, res) => {
    const deleteID = req.params.id
    const removedID = data.find(item => {item.id === deleteID})
    if(removedID) {
        dataArray = dataArray.filter(newItem => newItem.id === deleteID)
    }
    console.log(dataArray)
    
  })

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });