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
        res.send({user,token})
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
router.patch('/users/me', auth,async (req,res) =>{

            const updates = Object.keys(req.body)
            const allowedUpdates = ['name','password']
             const isValidOperation = updates.every((update) => {
                 return allowedUpdates.includes(update)
             })
             if(!isValidOperation) {
                 res.status(404).send('invalid update')
             }
    
             try {

            //const user = await User.findById(req.params.id)
            updates. forEach((update) => {
                req.user[update] = req.body[update]
                })
                await req.user.save()
            // bypasses the middleware
            //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators: true})
            console.log(req.user)
            if(!user){
                    return res.status(404).send('error getting the user')
                }
                res.status(200).send(req.user)
            }
        
        catch(e){
            res.send(e)
        }
    })
    
    // router.delete('/users/me', auth, async(req,res) => {
    //     try{
    //         // const user =  await User.findByIdAndDelete(req.user._id)
    //         // if(!user){
    //         //     return res.status(404).send()
    //         // }
    //         console.log(req.user)
    //         await req.user.remove()
    //         //console.log(req.user)
    //         res.send(req.user)
    //     } catch (e){
    //         res.status(500).send()
    //     }
    // })

    router.delete('/users/me', auth, async (req, res) => {
        try {
            await req.user.deleteOne()
            res.send(req.user)
        } catch (e) {
            res.status(500).send()
        }
    })
    

module.exports  = router
