'use strict'

var mongoose= require('mongoose');
var app= require('./app');
var PORT= 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser:true} ).then(()=>{
    console.log("Conectado a la base de datos");


    //CREAR SERVER Y ESCUCHAS HTTP
    app.listen(PORT, ()=>{
        console.log('servidor corriendo en htpp://localhost:'+PORT);
    });
});