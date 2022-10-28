const express = require('express');

var uniqid = require('uniqid'); 

const app = express();
const path = require("path");
const fs = require("fs");
const e = require('express');
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/notes', (req, res)=> {
    res.sendFile(path.join(__dirname, "./views/notes.html"))
})

// get all notes from db
app.get('/api/notes', (req, res)=>{
    fs.readFile("./db/db.json", "utf-8", (err,data)=> {
        if(err) {
            console.log(err);
            res.status(500).json({
                msg:"Error: Internal Server Error",
                err:err
            })
        } else{
            const dataArr = JSON.parse(data);
            res.json(dataArr)
        }
    })
})

// get one note from db
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


//  delete the node that has the id
app.delete('/api/notes/:id', (req, res)=>{
    fs.readFile("./db/db.json", "utf-8", (err,data)=>{
        if(err) {
            console.log(err);
            res.status(500).json({
                msg:"Error: Internal Server Error",
                err:err
            })
        } else{
            const dataArr = JSON.parse(data);
            
            // find the index of the object with the id from the array
            const objWithIdIndex = dataArr.findIndex((obj)=>obj.id == req.params.id)

            if ( objWithIdIndex >= 0 ) {
                dataArr.splice(objWithIdIndex, 1);
                fs.writeFile("./db/db.json", JSON.stringify(dataArr, null, 4), (err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).json({
                            msg:"Error: Internal Server Error",
                            err:err
                        })
                    } else{
                        res.send('Delete request success: note found and deleted. db.json updated')
                    }
                })
            } else {
                res.status(404).json({
                    msg:"Delete request fail: note with the id is not found"
                })
            }

        }
    })
})

// user input a new note -> save on the request body, add it to the db.json file 
app.post('/api/notes', (req, res)=>{

    fs.readFile("./db/db.json", "utf-8", (err, data)=>{
        if(err) {
            console.log(err);
            res.status(500).json({
                msg:"Error: Internal Server Error",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
        
            req.body.id=uniqid();
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

// every other request will direct to the home page
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, "./views/index.html"))
})


app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`)
})