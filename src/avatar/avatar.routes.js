import multer from 'multer';
import fs from 'fs';
import Avatar from '../avatar/avatar.model';

export default (app) => {

    const upload = multer({dest: './uploads/'});

    app.get('/api/avatar', (req, res) => {
        Avatar.find({}, '-data').exec()
            .then(avatars => {
                res.json({
                    status: true,
                    data: avatars
                });
            })
            .catch(err => {
                console.log(err);
            });
    });

    app.post('/api/avatar', upload.single('avatar'), (req, res) => {
        let avatar = new Avatar();
        avatar.fileName = req.file.originalname;
        avatar.contentType = req.file.mimetype;
        avatar.defaultImg = false;
        avatar.data = fs.readFileSync(req.file.path);
        avatar.save()
            .then(img => {
                fs.unlinkSync(req.file.path);
                res.json({message: 'avatar uploaded and saved...'});
            })
            .catch(err => {
                console.log(err);
            });
    });

    app.get('/api/avatar/:id', (req, res) => {
        if (req.params.id === 'default') {
            Avatar.findOne({defaultImg: true}).exec()
                .then(sendImage)
                .catch(err => {
                    console.log(err);
                });
        } else {
            Avatar.findById(req.params.id).exec()
                .then(sendImage)
                .catch(err => {
                    console.log(err);
                });
        }

        function sendImage(image) {
            res.contentType(image.contentType);
            res.write(image.data);
            res.end();
        }
    });
}
