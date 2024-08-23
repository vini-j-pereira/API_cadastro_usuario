const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json())
const port = 3000;


const UserRegister = mongoose.model('UserRegister', {
    email: String,
    user: String,
    passworld: String
});


app.get("/", async (req, res) => {
    const userRegister = await UserRegister.find()
    res.send(userRegister)
})

app.post("/", async (req, res) => {
    const userRegister = new UserRegister({
        email: req.body.email,
        user: req.body.user,
        passworld: req.body.passworld
    })

    await userRegister.save()
    res.send(userRegister)
})

app.listen(port, () => {
    mongoose.connect('mongodb+srv://viniciusjosepereira:nPjlFE38EiPrVfgY@api-cadastro-usuario.unc0z.mongodb.net/?retryWrites=true&w=majority&appName=api-cadastro-usuario')

    console.log('App running')
})