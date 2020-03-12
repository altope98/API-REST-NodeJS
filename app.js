'use strict'

//CARGA DE MODULOS DE NODE PARA CREAR SERVER
var express= require('express');
var bodyParser= require('body-parser');


//EJECUTAR EXPRESS (HTTP)
var app=express();

//CARGAR FICHEROS DE RUTAS
var article_router= require('./routes/article');

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//PREFIJOS A RUTAS  //CARGADO DE RUTAS
app.use('/api',article_router);


//EXPORTAR MODULO
module.exports=app;