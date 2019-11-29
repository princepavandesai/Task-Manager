const express= require('express')
const Task= require('../models/task')
const auth= require('../middleware/auth')
const router= new express.Router()

router.post('/tasks', auth, async(req, res) =>{
    // const tasks=Task(req.body)
    const task= new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send()
    }
    
})
//GET/tasks?Completed=true
//GET/tasks?Limit=10&skip=10
//GET/tasks?sortBy=createdAt:desc

router.get('/tasks', auth, async(req, res) =>{
    const match={}
    const sort={}

    if(req.query.Completed){
        match.Completed=req.query.Completed==='true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    try{        
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
        // const tasks = await Task.find({owner:req.user._id})
        // res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
    
})

router.get('/tasks/:id', auth, async(req, res)=>{
    const _id=req.params.id

    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.status(201).send(task)

    }catch(e){
        res.status(500).send()
    }
   
})
router.patch('/tasks/:id', auth, async(req, res) =>{
    const allowedTaskupdates= ['Completed','Description']
    const updateTask= Object.keys(req.body)
    const IsallowedTaskUpdates= updateTask.every((update) => allowedTaskupdates.includes(update))
    
    if(updateTask.length===0)
    {
        return res.status(400).send({error:'Input is missing'})
    }
    if(!IsallowedTaskUpdates){
        return res.status(400).send({error:'Invalid Updates!'})
    }
    try{
        const task = await Task.findOne({_id:req.params.id, owner:req.user._id})
        //const task = await Task.findById(req.params.id)     

        if(!task){
            return res.status(404).send()
        }
        updateTask.forEach((update) => task[update]=req.body[update] )
        await task.save()
        res.send(task)

    }catch(e){
        res.status(400).send(e)
    }
})
router.delete('/tasks/:id', auth, async(req, res) =>{

    try{
       // const task= await Task.findByIdAndDelete(req.params.id)
       const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router