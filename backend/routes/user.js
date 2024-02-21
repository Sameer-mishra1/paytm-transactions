import { Router } from 'express';
const zod = require('zod');
import { sign } from 'jsonwebtoken';
import { User } from '../db';
import JWT_SECRET from '../config';

const router = Router();

// Signup

const signupSchema = object({
    username: string().email(),
    password: string(),
    firstName: string(),
    lastName: string(),
})

router.post('/signup', async (req, res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if(!success) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: body.username
    })

    if (user._id) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create(body);
    const token = sign({
        userId: dbUser._id
    }, JWT_SECRET)
    res.json({
        message: "User created successfully!",
        token: token
    })

})

// Sign in
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})


router.post('/signin', async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })

})

// Other routes
const updateBody = zod({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/', authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)

    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.findOne({
        _id: req.userId
    }, req.body)

    res.json({
        message:"Updated successfully"
    })
})

router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


export default router; 