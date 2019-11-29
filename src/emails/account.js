const sendgrid=require('@sendgrid/mail')

sendgrid.setApiKey(process.env.SENDG_KEY)

const sendWelcomeEmail= (email, name) =>{
    sendgrid.send({
    to:email,
    from:'princepavandesai@gmail.com',
    subject:'Welcome To Task Application',
    text:`Welcome to the app, ${name}. Share the experience about the app`
    })
}

const sendCancelEmail = (email, name) =>{
    sendgrid.send({
        to:email,
        from:'princepavandesai@gmail.com',
        subject:'Sorry to see you go!',
        text:`Goodbye ${name}. I hope to see you back sometime soon`
    })
}

module.exports=({
    sendWelcomeEmail,
    sendCancelEmail
})
    
