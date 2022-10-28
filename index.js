const express = require('express');

const { v4: uuidv4 } = require('uuid');

const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/notes', (req, res)=> {
    // res.send('this is note html page');
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get('/api/notes', (req, res)=>{
    // res.send('this shold read the db.json and return all saved notes as json');
    fs.readFile("./db/db.json", "utf-8", (err,data)=> {
        if(err) {
            console.log(err);
            res.status(500).json({
                msg:"Error: Internal Server Error",
                err:err
            })
        } else{
            // console.log(data)
            const dataArr = JSON.parse(data);
            res.json(dataArr)
        }
    })
})

app.get('/api/notes/:id', (req, res)=>{
    fs.readFile("./db/db.json", "utf-8", (err,data)=>{
        if(err) {
            console.log(err);
            res.status(500).json({
                msg:"Error: Internal Server Error",
                err:err
            })
        } else{
            const dataArr = JSON.parse(data);
            console.log(req.params.id);
            for (let i = 0; i < dataArr.length; i++) {
                const note = dataArr[i];
                if (note.id == req.params.id) {
                    return res.json(note)
                }  
            }
            res.status(404).json({
                msg:"note not found"
            })
        }
    })
})



app.post('/api/notes', (req, res)=>{
    // res.send('this will receive a new note to save on the request body, add it to the db.json file, then return to the new note to the client. ')
    fs.readFile("./db/db.json", "utf-8", (err, data)=>{
        if(err) {
            console.log(err);
            res.status(500).json({
                msg:"Error: Internal Server Error",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            console.log("====");
            console.log(req.body);
            
            const newNote = req.body;
            newNote.id=uuidv4();

            dataArr.push(req.body);

            fs.writeFile("./db/db.json", JSON.stringify(dataArr, null, 4), (err,data)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        msg:"Error: Internal Server Error",
                        err:err
                    })
                } else{
                    res.json({
                        msg: "note added"
                    })
                }
            })
        }
    })
})

app.get('*', (req, res)=>{
    // res.send('this will return index.html')
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`)
})