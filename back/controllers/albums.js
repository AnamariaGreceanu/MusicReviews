const { faker } = require('@faker-js/faker')
const db=require('../config/config')

const generateFakeAlbums = async (req, res) => {
    try { 
        const no_albums = req.params.no_albums;
        for (let i = 0; i < no_albums; i++){
            const albumName = faker.music.album()
            const artist = faker.music.artist()
            const photoAlbum = faker.image.urlPicsumPhotos({
                width: 120,
                height: 120
            })
            const fakeAlbum = {
                'albumName': albumName,
                'artist': artist,
                'photoAlbum': photoAlbum
            }
            await db.collection('albums').add(fakeAlbum)
        }
        return res.status(201).json({message:'New albums added'})
    } catch (err) {
        return res.status(500).json({ message: 'Server error: ' + err })
    }
}

const getAllAlbums = async(req, res) => {
    let albums = [];    
    db.collection("albums").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let currentDoc = {...doc.data()};
            currentDoc.id = doc.id;
            albums.push(currentDoc);
        });
    }).then(()=>{
        if(albums.length !== 0) {
            return res.status(200).json(albums);
        } else {
            return res.status(404).json({message: "No albums found"})
        }
    }).catch((e)=>{
        res.status(500).json({message:"Server error"});
    });
};

module.exports={generateFakeAlbums, getAllAlbums}