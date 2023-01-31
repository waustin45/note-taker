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
  // add new notes to the json file
app.post('/api/notes', (req, res) => {
   const { title, text, id} = req.body
   
    // if the response has a body and a title then create a newNote object and push it into the array and update the json file.
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
  // Deletes specific notes from the json file
app.delete('/api/notes/:id', (req, res) => {
    const deleteID = req.params.id
    // loops through each item in the array looking for its ID and if it matches the param then that item is spiced out of the array
    for (let i = 0; i < data.length; i++) {
      if (deleteID == data[i].id) {
        console.log(data[i].id + "deleted")
        data.splice(i,1)
      } else {
        console.log("No match")
        
      }
      console.log(JSON.stringify(data[i]) + " iterated data")
    }
    
    console.log(JSON.stringify(data) + " final data")
    fs.writeFile("./db/db.json", JSON.stringify(data),  (err) => {
      if (err) {
          console.log(err)
      } else {
          console.log("written successfully")
      }
  })
  })

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });