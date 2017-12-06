import User from './user.model';
import { makeAvatarModel } from '../avatar/avatar.repository';

export function getUsers(queryCondition = {}, inclAvatars = false) {
    return new Promise((resolve, reject) => {
        let query;
        if (inclAvatars) {
            query = User.find(queryCondition).populate('avatar', '-data');
        } else {
            query = User.find(queryCondition);
        }

        query.exec()
            .then(users => resolve(users))
            .catch(err => reject(err));
    });
}

export function getUser(id, inclAvatar = false) {
    return new Promise((resolve, reject) => {
        let query;
        if (inclAvatar) {
            query = User.findById(id).populate('avatar', '-data');
        } else {
            query = User.findById(id);
        }

        query.exec()
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
}

export function lookupUserByEmail(email, inclAvatar = false) {
    return new Promise((resolve, reject) => {
        let query;
        if (inclAvatar) {
            query = User.findOne({email: email}).populate('avatar', '-data');
        } else {
            query = User.findOne({email: email});
        }

        query.exec()
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
}

export function deleteUser(id) {
    return new Promise((resolve, reject) => {
        User.findByIdAndRemove(id).exec()
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
}

export function updateUser(id, userData) {
    return new Promise((resolve, reject) => {
        User.findById(id).exec()
            .then(user => {
                for (let prop in userData) {
                    if (user[prop]) {
                        user[prop] = userData[prop];
                    }
                }
                resolve(user.save());
            })
            .catch(err => reject(err));
            });
}

export function uploadUserAvatar(id, file, deleteAfterUpload = true) {
    return new Promise((resolve, reject) => {
        let userPromise = getUser(id);
        let avatarPromise = userPromise.then(user => {
            let avatar = makeAvatarModel(file, user._id, deleteAfterUpload);
            return avatar.save();
        });

        Promise.all([userPromise, avatarPromise]).then(values => {
            let [user, img] = values;
            user.avatar = img._id;
            user.avatarUrl = `http://localhost:3000/api/avatar/${img._id}`;
            resolve(user.save());
        })
        .catch(err => reject(err));
    });
}

export function signUpUser(userData) {
    let newUser = new User(userData);
    return newUser.save();
}
