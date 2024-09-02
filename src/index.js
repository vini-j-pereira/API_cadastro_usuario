// Imports
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = 3000;

//Models
const UserRegister = require('./models/User')

// Middleware para permitir o recebimento de JSON no corpo da requisição
app.use(express.json());
// Middleware para permitir requisições de outros domínios (CORS)
app.use(cors());

//Registrando Usuário
app.post("/auth/register", async (req, res) => {
    const { email, telefone, password } = req.body;

    //validando
    if(!email) {
        return res.status(422).json({ msg: 'O email é obrigatorio!' });
    }

    if(!telefone) {
        return res.status(422).json({ msg: 'O telefone é obrigatorio! '});
    }

    if(!password) {
        return res.status(422).json({ msg: 'A senha é obrigatoria! '}); 
    }

    //Verificando se o usuario ja existe
    const userExists = await UserRegister.findOne({ email: email})

    if(userExists) {
        return res.status(422).json({ msg: 'Por favor, utilize outro e-mail!'}); 
    }

    //Criando a senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //Criando o ususario
    const newUser = new UserRegister({
        email,
        telefone,
        password: passwordHash,
    })

    try {

        await newUser.save();
        res.status(201).json({  msg: 'Usuário criado com sucesso!' });

    } catch(error) {
        console.log(error);
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!'});

    }
    
});

app.get("/", async (req, res) => {
    try {
        res.status(200).json({ msg: 'Bem vindo a nossa API!'});
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao buscar usuários'});
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

//Conectando

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@api-cadastro-usuario.unc0z.mongodb.net/?retryWrites=true&w=majority`,).then(() => {
    app.listen(port);
    console.log('Conectou ao Banco!')

})
.catch((err) => console.log(err))

//Parte de validação do login do usuario 

// app.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         //logando os dados recebidos
//         console.log('Dados recebidos:', { email, password });

//         //procurando o usuário pelo email
//         const user = await UserRegister.findOne({ email });
//         console.log('Usuário encontrado:', user);

//         if(!user) {
//             //Se o usuário não for encontrado, retornar erro
//             console.log('Usuário não encontrado');
//             return res.status(404).json({error: "Usuário não encontrado"});
//         }

//         //Verificando se a senha está correta
//         if(user.password !== password) {
//             console.log('Senha incorreta');
//             return res.status(401).json({error:'Senha incorreta'});

//         }

//         //Se tudo estiver correto, sucesso!
//         console.log('Login bem-sucedido');
//         return res.json({ message: 'Login bem-sucedido'});

//     } catch(error) {
//         //Capturando e logando qualquer erro
//         console.error('Erro ao realizar login:', error);
//         return res.status(500).json({error: 'Erro ao realizar login'});
//     }
//});

//Login User
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body

    //validando
    if(!email) {
        return res.status(422).json({ msg: 'O émail é obrigatorio!'});
    }

    if(!password) {
        return res.status(422).json({ msg: 'A senha é obrigatoria'});
    }

    //checando se usuário existe
    const user = await UserRegister.findOne({ email: email});

    if(!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado'});
    }

    // //checando a senha
    const checkPassword = await bcrypt.compare(password, user.password);


    if(!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!'});
    }

    try {

        const secret = process.env.SECRET;

        const token = jwt.sign({
            id: user._id,
        },
        secret,
    )

    res.status(200).json({ msg: 'Autenticação realizada com sucesso', token })

    } catch (error) {
        console.log(error)

        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!',

        })
    }
});

