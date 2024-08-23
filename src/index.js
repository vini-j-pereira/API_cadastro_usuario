// const express = require("express");
// const mongoose = require("mongoose");

// const app = express();
// app.use(express.json())
// const port = 3000;


// const UserRegister = mongoose.model('UserRegister', {
//     email: String,
//     user: String,
//     passworld: String
// });



// app.get("/", async (req, res) => {
//     const userRegister = await UserRegister.find()
//     return res.send(userRegister)
// })

// app.delete("/:id", async (req, res) => {
//     const userRegister = await UserRegister.findByIdAndDelete(req.params.id)
//     return res.send(userRegister)
// })

// app.put("/:id", async(req, res) => {
//     const userRegister = await UserRegister.findByIdAndUpdate(req.params.id, {
//         email: req.body.email,
//         user: req.body.user,
//         passworld: req.body.passworld
//     }, {
//         new: true
//     })

//     return res.send(userRegister)
// })

// app.post("/", async (req, res) => {
//     const userRegister = new UserRegister({
//         email: req.body.email,
//         user: req.body.user,
//         passworld: req.body.passworld
//     })

//     await userRegister.save()
//     return res.send(userRegister)
// })

// app.listen(port, () => {
//     mongoose.connect('mongodb+srv://viniciusjosepereira:nPjlFE38EiPrVfgY@api-cadastro-usuario.unc0z.mongodb.net/?retryWrites=true&w=majority&appName=api-cadastro-usuario')

//     console.log('App running')
// })

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware para permitir o recebimento de JSON no corpo da requisição
app.use(express.json());
// Middleware para permitir requisições de outros domínios (CORS)
app.use(cors());

// Conectando ao MongoDB
mongoose.connect('mongodb+srv://viniciusjosepereira:nPjlFE38EiPrVfgY@api-cadastro-usuario.unc0z.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((error) => {
    console.error('Erro ao conectar ao MongoDB', error);
});

const UserRegister = mongoose.model('UserRegister', {
    email: String,
    user: String,
    password: String
});

app.post("/", async (req, res) => {
    try {
        const { email, user, password } = req.body;
        const newUser = new UserRegister({ email, user, password });
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send('Erro ao cadastrar usuário');
    }
});

app.get("/", async (req, res) => {
    try {
        const users = await UserRegister.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send('Erro ao buscar usuários');
    }
});

app.delete("/:id", async (req, res) => {
    try {
        const user = await UserRegister.findByIdAndDelete(req.params.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Erro ao deletar usuário');
    }
});

app.put("/:id", async (req, res) => {
    try {
        const { email, user, password } = req.body;
        const updatedUser = await UserRegister.findByIdAndUpdate(req.params.id, {
            email,
            user,
            password
        }, { new: true });
        
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send('Erro ao atualizar usuário');
    }
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
