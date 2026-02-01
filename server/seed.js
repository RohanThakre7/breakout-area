const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Demo User Details
        const demoUsers = [
            {
                name: 'Alex Rivera',
                username: 'arivera',
                email: 'alex@example.com',
                password: 'password123',
                bio: 'Passionate about digital art and UI/UX design. Tech enthusiast.'
            },
            {
                name: 'Sarah Chen',
                username: 'schen_dev',
                email: 'sarah@example.com',
                password: 'password123',
                bio: 'Fullstack developer by day, competitive gamer by night. 🚀'
            },
            {
                name: 'Marcus Thorne',
                username: 'mthorne',
                email: 'marcus@example.com',
                password: 'password123',
                bio: 'Coffee lover, photographer, and world traveler. Living life one frame at a time.'
            }
        ];

        for (const userData of demoUsers) {
            // Check if user exists
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                user = new User(userData);
                await user.save();
                console.log(`Created user: ${user.username}`);

                // Create 2-3 posts for each user
                const posts = [
                    { text: `Hello everyone! Excited to be part of the Breakout Area. #firstpost` },
                    { text: `Just finished a new project! The monochrome aesthetic is really growing on me.` },
                    { text: `Nothing beats a good cup of coffee while coding at 2 AM. ☕️` }
                ];

                for (const postData of posts) {
                    const post = new Post({
                        ...postData,
                        author: user._id
                    });
                    await post.save();
                }
                console.log(`Created default posts for ${user.username}`);
            } else {
                console.log(`User ${user.username} already exists, skipping...`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
