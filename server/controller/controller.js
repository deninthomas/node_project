var Employeedb = require('../model/model');
const path = require("path");
const multer = require("multer");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "avatars");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// Multer upload configuration
const upload = multer({ storage: storage }).single("avatar");

// create and save new employee
exports.create = (req, res) => {
    console.log("init file", req.files);
    upload(req, res, async (error) => {
        if (error instanceof multer.MulterError) {
            console.log("init avatar", req.body.avatar);
            return res.status(400).json({ error: "image error" + error });
        } else if (error) {
            return res.status(500).json({ error: "server error " + error });
        } else {
            // Validate required fields
            const requiredFields = [
                "salutation",
                "firstName",
                "lastName",
                "email",
                "phone",
                "dob",
                "gender",
                "qualifications",
                "address",
                "city",
                "pincode",
                "state",
                "country",
                "username",
                "password",
            ];


            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res
                        .status(400)
                        .send({ message: `Error: Missing ${field} field` });
                }
            }

            console.log("Received Data:", req.body);
            console.log("Received File:", req.file);

            const avatarPath = req.file ? req.file.path : null;
            console.log(avatarPath);

            // new employee

            const employee = new Employeedb({
                salutation: req.body.salutation,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                dob: req.body.dob,
                country: req.body.country,
                address: req.body.address,
                qualifications: req.body.qualifications,
                state: req.body.state,
                city: req.body.city,
                pincode: req.body.pincode,
                username: req.body.username,
                password: req.body.password,
                avatar: avatarPath
            })

            // save employee in database
            employee
                .save(employee)
                .then(data => {
                    res.send(data)
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occured during create operation"
                    })
                })
        }
    });
};

//  retrieve and return all employees / retrieve and return a single employee
exports.find = (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 4;
    const skip = (page - 1) * limit;
    console.log(skip);

    if (req.query.id) {
        const id = req.query.id;

        Employeedb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found employee with id " + id })
                }
                else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving employee with id " + id })
            })
    }
    else {
        Employeedb.countDocuments().exec()
            .then(totalCount => {
                Employeedb.find()
                    .then(employee => {
                        employee.reverse();

                        const slicedData = employee.slice(skip, skip + limit);

                        res.status(200).json({
                            message: "ok",
                            length: totalCount,
                            data: slicedData,
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "error occured while retrieving information"
                        });
                    });
            });
    }
};

// Update a employee by id
exports.update = (req, res) => {

    upload(req, res, async (error) => {

        if (error instanceof multer.MulterError) {
            res.status(400).json({ err: "image upload erroe" })
        }
        else if (error) {
            res.status(500).json({ error: "server error" })
        }

        let avatarPath;
        if (req.file) {
            avatarPath = path.join('avatars', req.file.filename);
        } else {
            // If no new file is uploaded, keep the existing avatar path
            const emp = await Employeedb.findById(req.params.id);
            if (!emp) {
                res.status(404).json({ error: "employee not found" });
                return;
            }
            avatarPath = emp.avatar; // Use the existing avatar path
        }

        const emp = await Employeedb.findById(req.params.id);
        if (!emp) {
            res.status(404);
            throw new Error("employee not found")
        }

        // Update avatar only if a new file was uploaded
        const updateData = {
            ...req.body,
            ...(avatarPath ? { avatar: avatarPath } : {}), // Conditionally include avatar field
        };

        console.log(avatarPath)
        const upd = await Employeedb.findByIdAndUpdate(req.params.id, updateData, { new: true });
        console.log(upd)
        res.status(200).json(upd);
    })
};

// delete an employee with specified employee id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Employeedb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `cannot delete with id ${id} .maybe id is wrong` })
            }
            else {
                res.send({
                    message: "employee was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "could not delete employee with id= " + id
            });
        });
}

// search
exports.search = (req, res) => {
    const query = req.query.q.toString();
    console.log(query);
    Employeedb.find({
        $or: [
            { firstName: { $regex: new RegExp(query, "i") } },
            { lastName: { $regex: new RegExp(query, "i") } },
            { email: { $regex: new RegExp(query, "i") } },
        ],
    }).exec()
        .then(items => {
            res.json({
                data: items.reverse(),
                length: items.length,
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        });
};