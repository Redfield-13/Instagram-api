require("dotenv").config();
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const express = require('express');
const app = express();
const port = process.env.PORT || 6776;

console.log(process.env.IG_PASSWORD);

const ig = new IgApiClient();


ig.state.generateDevice(process.env.IG_USERNAME);

// const postToInsta = async () => {
    
//     ig.state.generateDevice(process.env.IG_USERNAME);
//     const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    
//     const imageBuffer = await get({
//         url: 'https://ai.system.sl/images/3ec3752b1e5e4e07a98e702ba1782708.jpeg',
//         encoding: null, 
//     });

//     try{
//         const res = await ig.publish.photo({
//             file: imageBuffer,
//             caption: '4K Frog!!', 
//         });
//         console.log(res.media.code);
//         return({"Post Url :" : "https://www.instagram.com/p/"+res.media.code})
//     }catch(error){
//         console.error('Error : ', error);
//         throw error;
//     }

    
    
// }
app.use(express.json())

const postToInsta = async (username, password, caption, imageUrl) => {
    
    


}

app.post('/post', async(req,res) =>{
    console.log(req.body);

    try{
        console.log("hiiiiii");
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

