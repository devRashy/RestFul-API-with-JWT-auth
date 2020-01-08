const express = require('express');
const User = require('../models/User')
const auth = require('../middleware/auth')
const router = express.Router()


router.post('/users', async (req,res) => {
    const  user = new User(req.body)
try{
     await user.save()
     const token = await user.generateAuthToken()
     if(!user){
         res.status(404).send()
     }
     res.status(200).send({user,token})
 } catch(e){
     res.send(e)
 }
})

router.post('/users/login', async(req,res)=> {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user: user.getPublicProfile,token})
    } catch(e){
         res.send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.post('/users/logout',auth,async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save
        res.send()

    } catch(e){
        res.status(500).send()

    }
})

router.get('/users/me',auth,async (req,res) => {
    try{
        res.send(req.user)
        }
     
    catch(e){
        res.send(e)
    }
})

router.get('/users/:id', auth,async(req,res) => {

    
    try{
        const id = req.params.id
        const user = await User.findById(id)
        if(!user){
            res.status(404).send()
        }
        res.status(200).send(user)
    } catch(e){
        res.send(e)
    }
})
router.patch('/users/:id', async (req,res) =>{

            const updates = Object.keys(req.body)
            const allowedUpdates = ['name','password']
             const isValidOperation = updates.every((update) => {
                 return allowedUpdates.includes(update)
             })
             if(!isValidOperation) {
                 res.status(404).send('invalid update')
             }
    
             try {
            const user = await User.findById(req.params.id)
            updates. forEach((update) => {
                user[update] = req.body[update]
                })
                await user.save()
            // bypasses the middleware
            //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators: true})
            console.log(user)
            if(!user){
                    return res.status(404).send('error getting the user')
                }
                res.status(200).send(user)
            }
        
        catch(e){
            res.send(e)
        }
    })
    
    router.delete('/users/:id', async(req,res) => {
        try{
            const user =  await User.findByIdAndDelete(req.params.id)
            if(!user){
                return res.status(404).send()
            }
            res.send(user)
        } catch (e){
            res.status(500).send()
        }
    })

module.exports  = router
