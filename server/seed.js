const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const dotenv = require('dotenv');

dotenv.config();

const users = [
    {
        name: 'Admin User',
        username: 'admin',
        email: 'admin@socialhub.com',
        password: 'password123',
        bio: 'I am the admin of SocialHub.',
    },
    {
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password123',
        bio: 'Software engineer and cat lover.',
    },
    {
        name: 'Bob Smith',
        username: 'bobsmith',
        email: 'bob@example.com',
        password: 'password123',
        bio: 'Traveler and foodie.',
    }
];

const seedDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialhub';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB for seeding');

        await User.deleteMany({});
        await Post.deleteMany({});

        const createdUsers = await User.create(users);
        console.log('Users seeded');

        const posts = [
            {
                author: createdUsers[0]._id,
                text: 'Welcome to SocialHub! This is the first post.',
            },
            {
                author: createdUsers[1]._id,
                text: 'Just joined! Looking forward to connecting with everyone.',
            },
            {
                author: createdUsers[2]._id,
                text: 'Lunch was amazing today! #foodie',
            }
        ];

        await Post.create(posts);
        console.log('Posts seeded');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
