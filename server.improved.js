const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

let today = new Date(),
    month = today.getMonth() + 1,
    day = today.getDate(),
    year = today.getFullYear(),
    formattedDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2,'0')}-${year.toString().padStart(4, '0')}`;

let tasks = [
  {task: "Assignment 2", completed: false, dueDate:formattedDate},
  {task: "Assignment 3", completed: false, dueDate:formattedDate}
  //{"title": "I made paper today!", "text": "My roommates and I have been saving our egg cartons for the past two years which is great material to make thick paper and starter pots for plants." },
  //{"title": "Started a compost", "text": "I always need more potting soil for my tomato plants, and by the end of our week our trash bag fills up with banana peels, vegetable stems, and eggshells. I found a trash bucket at the thrift store and I've finally set it up! Right now I have a glass jar on the kitchen counter to collect scraps, soil in my container, and I put a wet piece of cardboard outside to collect worms for the compost. I've been in an awful mood and I'm so proud of myself for doing something to feel better" }
];

const server = http.createServer((request,response )  => {
  if( request.method === "GET" ) {
    if (request.url === "/tasks"){
      response.writeHead(200, {"Content-Type": "application/json"});
      response.end(JSON.stringify(tasks));
    } else {
      handleGet( request, response );
    } 
  } else if( request.method === "POST" ){
    handlePost( request, response ) 
  } else if (request.method === "PATCH"){
    handlePatch(request, response)
  } else if (request.method === "DELETE"){
    handleDelete(request, response)
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ""

  /*let url = request.url.slice(1);
  if (url === "/submit") {
    // do something with data
  } 
  else if (url === "/update") {
    // do something else with this data
  }*/
  
  request.on( "data", function( data ) {
      dataString += data; 
  });

  request.on( "end", function() {
    const newTask = JSON.parse( dataString );
    if (!newTask.dueDate) newTask.dueDate = formattedDate;
    if (!newTask.hasOwnProperty("completed")) newTask.completed = false;

    tasks.push(newTask);
    console.log("Added: ", newTask);

    response.writeHead( 200, {"Content-Type": "application/json" })
    response.end(JSON.stringify(tasks))
  })
}

const handlePatch = function (request, response) {
  let dataString = "";
  request.on("data", chunk => dataString += chunk);
  request.on("end", () => {
    const parsed = JSON.parse(dataString);
    if (parsed.originalTask && parsed.newTask){
      const task = tasks.find(t => t.task === parsed.originalTask);
      if (task) task.task = parsed.newTask;
    } else {
      const task = tasks.find(t => t.task === parsed.task);
      if (task){
        if (parsed.hasOwnProperty('completed')) task.completed = parsed.completed;
        if (parsed.hasOwnProperty('dueDate')) task.dueDate = parsed.dueDate;
      }
    }
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(tasks));
  });
};

const handleDelete = (request, response) => {
  let taskName = decodeURIComponent(request.url.split("/")[2]);
    tasks = tasks.filter(t => t.task !== taskName);
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify({success:true}));
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHead( 200, { "Content-Type": type })
       //response.end(JSON.stringify(tasks));
       response.end(content);

     }else{

       // file not found, error code 404
       response.writeHead( 404 );
       response.end( "404 Error: File Not Found" )

     }
   })
}

server.listen( process.env.PORT || port );
