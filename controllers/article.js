'use strict'

var validator=require('validator');
var fs= require('fs');
var path=require('path');
var Article=require('../models/article');

var controller = {


    datosCurso: (request,response)=>{
        var x=request.body.blas;
        return response.status(200).send({
            curso: 'Master',
            autor: "Alvaro",
            url:"mitsubishi.lancer",
            x
        });
    },

    
    test: (request, response)=>{
        return response.status(200).send({
            message: 'Soy la accion TEST de controlador de articulos'
        });
    },


    save: (request,response)=>{
        //RECOGER PARAMETROS POR POSRT
        var params=request.body;

        //VALIDAR DATOS
        try{

            var validate_title=!validator.isEmpty(params.title);
            var validate_content=!validator.isEmpty(params.content);
            
        }catch(error){
            return response.status(200).send({
                status:'error',
                message:"Faltan datos"
            });
        }

        if(validate_title && validate_content){
            //CREAR OBJETO A GUARDAR
            var article=new Article();
            //ASIGNAR VALORES
            article.title=params.title;
            article.content=params.content;
            article.image=null
            //GUARDAR Y RESPUESTA

            article.save((error,articleStored)=>{
                if(error || !articleStored){
                    return response.status(404).send({
                        status:'error',
                        message:"El articulo no se ha guardado"
                    });
                }

                return response.status(200).send({
                    status:'success',
                    article: articleStored
                });
            });
            
        }else{
            return response.status(200).send({
                status:'error',
                message:"Datos no validos"
            });
        }
    },


    getArticles:(request,response)=>{
        var query=Article.find({});
        var last=request.params.last;

        if(last || last!= undefined){
            query.limit(5);
        }

        query.sort('-_id').exec((error,articles)=>{
            if(error){
                return response.status(500).send({
                    status:'error',
                    message:'Error al devolver articulos'
                });
            }
            if(!articles){
                return response.status(404).send({
                    status:'error',
                    message:'No hay articulos'
                });
            }
            return response.status(200).send({
                status:'success',
                articles
            });
        })  
    },


    getArticle:(request, response)=>{
        var articleId= request.params.id;

        if(!articleId || articleId==null){
            return response.status(404).send({
                status:'error',
                message:'No existe el articulo'
            });
        }

        Article.findById(articleId, (error, article)=>{
            if(error){
                return response.status(500).send({
                    status:'error',
                    message:'Error al devolver articulo'
                });
            }
            if(!article){
                return response.status(404).send({
                    status:'error',
                    message:'No existe articulo'
                });
            }
            return response.status(200).send({
                status:'success',
                article
            });
        })
    },


    update:(request, response)=>{
        var articleId= request.params.id;

        //DATOS QUE LLEGAN DEL PUT
        var params=request.body;

        //VALIDAR DATOS
        try{
            var validate_title=!validator.isEmpty(params.title);
            var validate_content=!validator.isEmpty(params.content);

        }catch(error){
            return response.status(200).send({
                status:'error',
                message:"Faltan datos"
            });
        }

        if(validate_content && validate_title){
            //FIND AND UPDATE
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (error,articleUpdated)=>{
                if(error){
                    return response.status(500).send({
                        status:'error',
                        message:"Error al actualizar"
                    });
                }
                if(!articleUpdated){
                    return response.status(404).send({
                        status:'error',
                        message:'No se ha actualizado el articulo'
                    });
                }
                return response.status(200).send({
                    status:'success',
                    article: articleUpdated
                });
            });
        }else{
            return response.status(200).send({
                status:'error',
                message:"Datos no validos"
            });
        }
    },

    
    delete:(request, response)=>{
        var articleId= request.params.id;

        Article.findOneAndDelete({_id: articleId}, (error,articleRemoved)=>{
            if(error){
                return response.status(500).send({
                    status:'error',
                    message:"Error al borrar"
                });
            }
            if(!articleRemoved){
                return response.status(404).send({
                    status:'error',
                    message:'No se ha eliminado el articulo o no existe'
                });
            }
            return response.status(200).send({
                status:'success',
                article: articleRemoved
            });
        });
    },


    upload:(request, response)=>{
        //CONFIGURAR CONNECT MULTIPARTY EN ROUTER/ARTICLE.JS
        //RECOGER FICHER
        var file_name= 'Imagen no subida...';

        if(!request.files){
            return response.status(404).send({
                status:'error',
                message:file_name
            });
        }

        //CONSEGUIR NOMBRE Y EXTENSION
        var file_path=request.files.file0.path;
        var file_split=file_path.split('\\');

        file_name=file_split[2];
        
        var extension_split= file_name.split('\.');
        var file_ext=extension_split[1];

        //* ADVERTENCIA * EN LINUX O MAC var file_split=file_path.split('/')

        //COMPROBAR LA EXTENSION, SOLO IMAGENES
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'PNG' && file_ext != 'JPG' && file_ext != 'JPEG'){
            fs.unlink(file_path, (error)=>{
                return response.status(200).send({
                    status:'error',
                    message:'La extension de la imagen no es valida'
                });
            })
        }else{
            //SI TODO ES VALIDO
            //BUSCAR ARTICULO Y ASIGNARLE LA IMAGEN
            var articleId=request.params.id
            Article.findByIdAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (error, articleUpdated)=>{
                if(error){
                    return response.status(500).send({
                        status:'error',
                        message:"Error al actualizar"
                    });
                }
                if(!articleUpdated){
                    return response.status(404).send({
                        status:'error',
                        message:'No se ha actualizado la imagen'
                    });
                }


                return response.status(200).send({
                    status:'success',
                    article: articleUpdated
                });
            });
            
        }
    },


    getImage:(request, response)=>{
        var file= request.params.image;
        var path_file='./upload/articles/'+file;
        fs.exists(path_file, (exists)=>{
            if(exists){ 
                return response.sendFile(path.resolve(path_file));
            }else{
                return response.status(404).send({
                    status:'error',
                    message:'La imagen no existe'
                });
            }
        })
        
    },


    search:(request, response)=>{
        //SACAR STRING A BUSCAR
        var searchString= request.params.search;
        //FIND OR 
        Article.find({
            "$or":[
                {"title":{"$regex": searchString, "$options": "i"}},
                {"content":{"$regex": searchString, "$options": "i"}}
            ]}).sort([['date', 'descending']]).exec((error, articles)=>{
                if(error){
                    return response.status(500).send({
                        status:'error',
                        message:"Error al buscar"
                    });
                }
                if(!articles || articles.length<=0){
                    return response.status(404).send({
                        status:'error',
                        message:'No existe ningun articulo con esa busqueda'
                    });
                }


                return response.status(200).send({
                    status:'success',
                    articles
                });
            })

    },



};


module.exports= controller;