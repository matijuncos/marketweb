const User = require('../models/User')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const path = require('path')
const imgbbUploader = require("imgbb-uploader");

const userController = {
  newUser: async(req, res) => {
    try {
      const { firstName, lastName, email, password, pic, rol, google} = req.body
      const userExists = await User.findOne({ email: email})//buscamos coincidencia
      if (userExists) {
        let error = [{ path: ['useremailExist'] }] //si el email ya existe
        return res.json({ success: false, error: error }) //retorna este error.
      }else{
        const hashedPassword = bcryptjs.hashSync(password, 10) //encriptamos password
        var newUser = new User({
          firstName, lastName, email, password: hashedPassword, pic, rol
            })
        if(google !== 'true'){
          const {fileUrlPic}=req.files
          if(fileUrlPic.mimetype.indexOf('image/jpg')!==0&&fileUrlPic.mimetype.indexOf('image/jpeg')!==0&&fileUrlPic.mimetype.indexOf('image/png')!==0&&fileUrlPic.mimetype.indexOf('image/bmp')!==0){
            return res.json({success:false,error:"El formato de la imagen tiene que ser JPG,JPEG,BMP ó PNG."})
          }
          const extPic=fileUrlPic.name.split('.',2)[1]
          ///../client/build/usersPics/
          fileUrlPic.mv(`${__dirname}/../frontend/public/assets/userPics/${newUser._id}.${extPic}`,error =>{
             if(error){
                return res.json({success:false,error:"Intente nuevamente..."})
             }
          })
          newUser.pic=`./assets/userPics/${newUser._id}.${extPic}`
       }else{
        newUser.pic=pic
       }
        var newUserSaved = await newUser.save() //intentamos guardar en la db
        var token = jwt.sign({ ...newUserSaved }, process.env.SECRET_KEY, {}) 
          return res.json({
            success: true,
            response: {
              token,
              firstName: newUserSaved.firstName,
              lastName: newUserSaved.lastName,
              email: newUserSaved.email,
              pic: newUserSaved.pic,
              userId: newUserSaved._id
            }
          })
    }//fin if exist account
    } catch (error) {
      return res.json({success: false, error })
    }
},
logIn: async (req, res) => {
  try {
      const { email, password } = req.body
      const userExists = await User.findOne({ email: email })
      if (!userExists) {
          return res.json({ success: false, error: 'Incorrect email and / or password.' })//si el email no coincide
      }
      const passwordMatches = bcryptjs.compareSync(password, userExists.password)//si la password no coincide
      if (!passwordMatches) {
          return res.json({ success: false, error: 'Incorrect email and / or password.' })
      }
      var token = jwt.sign({ ...userExists }, process.env.SECRET_KEY, {})
      return res.json(
          {
              success: true, response: {
                  token,
                  firstName: userExists.firstName,
                  lastName: newUserSaved.lastName,
                  email: userExists.email,
                  userId: userExists._id,
                  pic:userExists.pic
              }
          })//al confirmar assets para form agregar pic
  } catch (error) {
      res.json({ success: false, error })
  }
},

modifyUser: async(req, res) => {
  const {id, email, firstName, lastName} = req.body
  const {pic} = req.files
  const extPic=pic.name.split('.',2)[1]
  const url = `${__dirname}/../frontend/public/assets/userPics/${id}.${extPic}`
  var urlPhoto=''
  try {
    pic.mv(`${__dirname}/../frontend/public/assets/userPics/${id}.${extPic}`, errores=> {
      if(errores) {
        console.log("Error al subir la foto al servidor: "+errores);
      }})
  } catch (error) {
    console.log("Error al subir la foto al servidor: "+error);
  }
    try {
      const response= await imgbbUploader(process.env.IMGBB_KEY,url,)
      urlPhoto=response.url
    } catch (error) {
      console.log("Error al subir la foto al servidor: "+error);
    }
    try {
      const res=User.findOneAndUpdate({_id: id},
        {$set: {firstName, email, lastName, pic: urlPhoto}},{new: true})
      res.json({ success: true, response: data })
    } catch (error) {
      res.json({ success: false, error })
    }
},

logFromLS: (req, res) => {
  try {
    res.json({
      success: true, response: {
        token: req.body.token,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        pic: req.user.pic,
        email: req.user.email,
        userId: req.user._id
        }
      })
  } catch (error) {
      res.json({ success: false, error })
  }
}
}

module.exports = userController