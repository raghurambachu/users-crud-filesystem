const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const qs = require("querystring");

const userPath = path.join(__dirname + "/users/");
// console.log(userPath);

const server = http.createServer(requestHandler);

function requestHandler(req,res){
    let store = "";
    req.on("data",(chunk) => {
        store = store + chunk;
    })
    req.on("end",() => {
        const parsedUrl = url.parse(req.url,true);
        const pathName = parsedUrl.pathname;
        const method = req.method;
        console.log(pathName,method)

        //Creating the User
        if(pathName === "/users" && method === "POST"){
            const parsedData = JSON.parse(store);
            const userName = parsedData.userName;
            fs.open(userPath + userName + ".json","wx",(error,fd) => {
                if(error) return console.error(error);
                fs.writeFile(fd,store,error => {
                    if(error) return console.error(error);
                    fs.close(fd,error => {
                        if(error) return console.error(error);
                        res.end(userName + " created successfully");
                    })
                });
            }) 
        } else if(pathName === "/users" && method === "GET"){
            //Reading the user
            const query = parsedUrl.query;
            fs.readFile(userPath + query.username + ".json",(error,content) => {
                if(error) return console.error(error);
                res.end(content);
            })
        } else if(pathName === "/users" && method === "PUT"){
            //Updating the user
            const query = parsedUrl.query;
            fs.open(userPath + query.username + ".json","r+",(error,fd) => {
                if(error) return console.error(error);
                fs.ftruncate(fd, error => {
                    if(error) return console.error(error);
                    fs.writeFile(fd,store,error => {
                        if(error) return console.error(error);
                        res.end("successfully updated to " + JSON.parse(store).userName);
                    })
                })
            })
        } else if(pathName === "/users" && method === "DELETE"){
            //Deleting the user
            const query = parsedUrl.query;
            fs.unlink(userPath + query.username + ".json",error => {
                if(error) return error;
                res.end(query.username + " successfully removed");
            })
        }
    })
}


server.listen(3000,() => console.log("Server started successfully @ 3000"));