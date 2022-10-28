const express = require('express');

var uniqid = require('uniqid'); 

const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/notes', (req, res)=> {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

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
            // console.log("****")
            // console.log(dataArr);
            // console.log(req.params.id);
            
            const newDataArr = dataArr.filter((noteObj) => noteObj.id !== req.params.id)
            console.log(newDataArr);
            if ( dataArr.length === newDataArr.length){
                res.status(404).json({
                        msg:"Delete request fail: note with the id is not found"
                    })
            } else {
                fs.writeFile("./db/db.json", JSON.stringify(newDataArr, null, 4), (err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).json({
                            msg:"Error: Internal Server Error",
                            err:err
                        })
                    } else{
                        res.send('Delete request success: note found and deleted')
                    }
                })
            }

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

app.get('*', (req, res)=>{
    // res.send('this will return index.html')
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`)
})