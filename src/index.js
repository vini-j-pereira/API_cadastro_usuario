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
    telefone: Number,
    password: String
});

app.post("/", async (req, res) => {
    try {
        const { email, telefone, password } = req.body;
        const newUser = new UserRegister({ email, telefone, password });
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
        const { email, telefone, password } = req.body;
        const updatedUser = await UserRegister.findByIdAndUpdate(req.params.id, {
            email,
            telefone,
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

//Parte de validação do login do usuario 

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //logando os dados recebidos
        console.log('Dados recebidos:', { email, password });

        //procurando o usuário pelo email
        const user = await UserRegister.findOne({ email: email.trim() });
        console.log('Usuário encontrado:', user);

        if(!user) {
            //Se o usuário não for encontrado, retornar erro
            console.log('Usuário não encontrado');
            return res.status(404).send('Usuário não encontrado');

        }

        //Verificando se a senha está correta
        if(user.password !== password) {
            console.log('Senha incorreta');
            return res.status(401).send('Senha incorreta');

        }

        //Se tudo estiver correto, sucesso!
        console.log('Login bem-sucedido');
        res.status(200).send('Login bem-sucedido');

    } catch(error) {
        //Capturando e logando qualquer erro
        console.error('Erro ao realizar login:', error);
        res.status(500).send('Erro ao realizar login');
    }
});

