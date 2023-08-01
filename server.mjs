import 'dotenv/config';
import express from 'express';
import bodyParser from "body-parser";
import __dirname from "path";
import * as images from './images_models.mjs';

const app = express() 
app.use(express.static(__dirname + '/random_pictures'))

app.get("/random-image", async (req, res) => {
    const image = await images.getRandomImage();
    console.log(`${image[0].fileName} is going to be displayed`)
    res.sendFile(`random_pictures/${image[0].fileName}`, {root: '.'})
})

app.post("/add-image", bodyParser.json(), (req, res) => {
    images.createImage(req.body.fileName)
        .then(image => {
            res.status(201).send(image);
        })
        .catch(error => {
            console.error(error);
            res.status(400).send({ Error: "Invalid request"});
        });
});

app.get("/images", (req, res) => {
    let filter = {}
    images.findImages(filter, '', 0)
        .then(images => {
            res.send(images)
        })
        .catch(error => {
            console.error(error);
            res.status(400).send({ Error: 'Invalid request'});
        });
});

app.delete('/image/:_id', (req, res) => {
    images.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(200).send({Successful :`Successfully deleted ${deletedCount} item`});
            } else {
                res.status(404).send({Error: 'Not found'})
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).send({ Error: 'Invalid request'});
        })
});

app.get('/image/:_id', (req, res) => {
    const imageId = req.params._id
    images.findImageById(imageId)
        .then(images => {
            res.sendFile(`random_pictures/${images.fileName}`, {root: '.'})
            // res.send(images)
        })
        .catch(error => {
            console.error(error);
            res.status(400).send({ Error: 'Invalid request'});
        });
});


app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('listening on port', process.env.PORT)
})

