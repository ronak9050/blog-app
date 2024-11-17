const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/blogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Blog Schema and Model
const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

// Routes

// Home Route - Display all blogs
app.get('/', async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('index', { blogs });
});

// Route to show form for creating a new blog
app.get('/blogs/new', (req, res) => {
    res.render('create');
});

// Route to handle blog creation
app.post('/blogs', async (req, res) => {
    const { title, content } = req.body;
    await Blog.create({ title, content });
    res.redirect('/');
});

// Route to delete a blog
app.post('/blogs/:id/delete', async (req, res) => {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.redirect('/');
});

// Route to show a single blog
app.get('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.render('show', { blog });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
