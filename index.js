if (process.env.NODE_EVN !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const shortUrlModel = require('./models/url.models')
const app = express();


mongoose.connect('mongodb://localhost:27017/urls').then(() => console.log('db connected')).catch(err => console.log('db err', err))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
    const shortUrls = await shortUrlModel.find({});
    res.render('index', { shortUrls });
})

app.post('/shortUrls', async (req, res) => {
    await shortUrlModel.create({ full: req.body.fullUrl });
    res.redirect('/')
})


app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await shortUrlModel.findOne({ short: req.params.shortUrl })

    if (shortUrl === null) return res.status(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
})

app.listen(process.env.PORT, () => {
    console.log('server is running');
})