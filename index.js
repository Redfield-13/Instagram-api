require("dotenv").config();
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const express = require('express');
const winston = require('winston');



const app = express();
const port = process.env.PORT || 6776;


const ig = new IgApiClient();
app.use(express.json())

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  });

app.post('/post', async(req,res) =>{
    logger.info(req.body)

    try{
        const { caption, imageUrl, username, password } = req.body;
        ig.state.generateDevice(username);
        const loggedInUser = await ig.account.login(username, password);
        
        const imageBuffer = await get({
            url: imageUrl,
            encoding: null, 
        });
        console.log(imageUrl);
        try{
            const response = await ig.publish.photo({
                file: imageBuffer,
                caption: caption, 
            });
            console.log(response.media.code);
            res.json({ "Post Url": `https://www.instagram.com/p/${response.media.code}` });
        }catch(error){
            console.error('Error : ', error);
            res.status(500).json({ error: 'Failed to post to Instagram' });
        }
            console.log(username);
            ig.state.generateDevice(username);

        } catch (error) {
    console.error('Error in POST /post:', error);
    res.status(500).json({ error: 'Internal server error' });
}
})



  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

