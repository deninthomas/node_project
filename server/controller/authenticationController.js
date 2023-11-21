var Logindb = require('../model/loginmodel');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");


// Authentication
// Register user
exports.signup = async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    let email = data.name;
    // check if user already exist
    const existingUser = await Logindb.findOne({ name: data.name });

    if (existingUser) {
        res.status(400).json("User already exists. Please choose a different username.");
        console.log('User already exists. Please choose a different username.');
    }
    else {

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            secure: false,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: 'e8d20cacb3f018',
                pass: '4eb937791d830e'
            }
        });

        async function main() {
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: "bar@example.com, baz@example.com", // list of receivers
                subject: "Hello ✔", // Subject line
                // text: "Hello world?", // plain text body
                html: `<html>
                <head>
                <style>
                p{
                    font-size : 14px;
                    color : black;
                }
                </style>
                </head>
                <body>
                <b>successfully signed in</b>
                <p>Hello ${email}</p>
                <p>You registered an account on STACKUP employees portal, before being able to use your account you need to verify that this is your email address by clicking here: </p>
                <a href="https://www.w3schools.com/">verify</a>
                <p>Kind Regards,</p>
                <p>Stackup</p>
                </body>
                </html>`,
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            //
            // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
            //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
            //       <https://github.com/forwardemail/preview-email>
            //
        }
        main().catch(console.error);

        // req
        // hashing password
        // const saltRounds = 10;
        // const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // data.password = hashedPassword;

        // req
        // const userdata = await Logindb.insertMany(data);
        // console.log(userdata);

        // session after successful signup
        // req
        // req.session.user = userdata;
        // res.redirect("/login");
        // res.status("suucessfully logged");
        res.status(200).json("User created");

    }
};

// login
// login
exports.login = async (req, res) => {
    console.log(req.body.username);
    try {
        const check = await Logindb.findOne({ name: req.body.username });
        console.log("ch",check);
        if (!check) {
            console.log("check");
            res.status(404).json("User not found");
        } else {
            const isPasswordmatch = await bcrypt.compare(req.body.password, check.password)
            console.log("pass",isPasswordmatch);
            if (isPasswordmatch) {
                // Set the user session upon successful login
                req.session.user = check;
                // Redirect after setting the session, not before
                console.log("Before redirect");
                // res.render("index")
                res.json(true);


                // Do not continue processing after redirect
                return;
            } else {
                // res.send("wrong password");
                res.status(500).json("wrong password");
            }
        }
    } catch (error) {
        console.error(error);
        res.status(400).json("wrong details");
    }
}


exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        }
        res.redirect("/")
    });
}