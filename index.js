require("dotenv").config();
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const express = require('express');
const winston = require('winston');

const { combine, timestamp, json } = winston.format;



const app = express();
const port = process.env.PORT || 6776;


const ig = new IgApiClient();
app.use(express.json())

const logger = winston.createLogger({
    level: 'debug',
    format: combine(timestamp(), json()),
    transports: [new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/ServerLogs.log' }),
    ],
    
  });

app.post('/post', async(req,res) =>{
    logger.info({"Body":"Caption : "+req.body.caption +", Image : "+ req.body.imageUrl +", Username : "+ req.body.username })

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
            logger.info({"Post ID":response.media.code});
            res.json({ "Post Url": `https://www.instagram.com/p/${response.media.code}` });
        }catch(error){
            logger.error({"Error": error})
            res.status(500).json({ error: 'Failed to post to Instagram' });
        }
            console.log(username);
            ig.state.generateDevice(username);

        } catch (error) {
    logger.error('Error in POST /post:', error);
    res.status(500).json({ error: 'Internal server error' });
}
})



  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

