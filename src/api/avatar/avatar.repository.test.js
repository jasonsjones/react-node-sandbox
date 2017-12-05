import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';

import Avatar from './avatar.model';
import * as AvatarRepository from './avatar.repository';

const mockAvatars = [
    {
      "_id": "59c44d83f2943200228467b0",
      "contentType": "image/png",
      "fileSize": 5012,
      "defaultImg": true,
      "user": null
    },
    {
      "_id": "59c44d85f2943200228467b4",
      "contentType": "image/png",
      "fileSize": 62079,
      "defaultImg": false,
      "user": "59c44d83f2943200228467b1"
    },
    {
      "_id": "59c44d9d0e584d00425c1722",
      "contentType": "image/png",
      "fileSize": 71955,
      "defaultImg": false,
      "user": "59c44d83f2943200228467b2"
    },
    {
      "_id": "59c44dc50e584d00425c1723",
      "contentType": "image/png",
      "fileSize": 138317,
      "defaultImg": false,
      "user": "59c44d83f2943200228467b3"
    },
    {
      "_id": "59e4062a4c3bc800574e895f",
      "contentType": "image/png",
      "fileSize": 117632,
      "defaultImg": false,
      "user": "59c6c317f9760b01a35c63b1"
    }
];

describe('Avatar Repository', function () {
    let AvatarMock;
    afterEach(function () {
        AvatarMock.restore();
    });

    describe('getAvatars()', function () {
        it('resolves to an array of avatars', function () {
            AvatarMock = sinon.mock(Avatar);
            AvatarMock.expects('find').withArgs({})
                .chain('exec')
                .resolves(mockAvatars);

            const promise = AvatarRepository.getAvatars();
            expect(promise).to.be.a('Promise');

            return promise.then(avatars => {
                expect(avatars).to.be.an('array');
                expect(avatars.length).to.equal(5);
            });
        });

        it('rejects with an error if something went wrong', function () {
            AvatarMock = sinon.mock(Avatar);
            AvatarMock.expects('find').withArgs({})
                .chain('exec')
                .rejects(new Error('Oops, something went wrong...'));

            const promise = AvatarRepository.getAvatars();
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });
    });

    describe('getAvatar()', function () {
        it('with default id resolves to the default image', function () {
            AvatarMock = sinon.mock(Avatar);
            AvatarMock.expects('findOne').withArgs({defaultImg: true})
                .chain('exec')
                .resolves(mockAvatars[0]);

            const promise = AvatarRepository.getAvatar('default');
            expect(promise).to.be.a('Promise');
            return promise.then(avatar => {
                expect(avatar).to.be.an('object');
                expect(avatar).to.have.property('contentType');
                expect(avatar).to.have.property('fileSize');
                expect(avatar).to.have.property('defaultImg');
                expect(avatar).to.have.property('user');
                expect(avatar.defaultImg).to.equal(true);
                expect(avatar.user).to.be.null;
            });
        });

        it('with default id rejects with error if something goes wrong', function () {
            AvatarMock = sinon.mock(Avatar);
            AvatarMock.expects('findOne').withArgs({defaultImg: true})
                .chain('exec')
                .rejects(new Error('Oops, something went wrong getting default image'));

            const promise = AvatarRepository.getAvatar('default');
            expect(promise).to.be.a('Promise');
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });

        it('with avatar id resolves to the avatar with that id', () => {
            AvatarMock = sinon.mock(Avatar);
            AvatarMock.expects('findById').withArgs(mockAvatars[1]._id)
                .chain('exec')
                .resolves(mockAvatars[1]);
            const promise = AvatarRepository.getAvatar(mockAvatars[1]._id);
            expect(promise).to.be.a('Promise');

            return promise.then(avatar => {
                expect(avatar).to.be.an('object');
                expect(avatar).to.have.property('contentType');
                expect(avatar).to.have.property('fileSize');
                expect(avatar).to.have.property('defaultImg');
                expect(avatar).to.have.property('user');
                expect(avatar.defaultImg).to.equal(false);
                expect(avatar.user).not.to.be.null;
            });
        });

        it('with avatar id rejects with error if something goes wrong with the lookup', () => {
            AvatarMock = sinon.mock(Avatar);
            AvatarMock.expects('findById').withArgs(mockAvatars[3]._id)
                .chain('exec')
                .rejects(new Error('Oops, something went wrong getting image'));
            const promise = AvatarRepository.getAvatar(mockAvatars[3]._id);
            expect(promise).to.be.a('Promise');
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });
    });

    describe('deleteAvatar()', function () {
        it('with avatar id rejects with error if something goes wrong with the lookup', () => {
            AvatarMock = sinon.mock(Avatar);
            AvatarMock.expects('findById').withArgs(mockAvatars[3]._id)
                .chain('exec')
                .rejects(new Error('Oops, something went wrong getting image'));
            const promise = AvatarRepository.deleteAvatar(mockAvatars[3]._id);
            expect(promise).to.be.a('Promise');
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });

        it('with avatar id resolves with avatar.remove()', () => {
            const stub = sinon.stub(Avatar.prototype, 'remove');
            stub.resolves(new Avatar(mockAvatars[3]));

            AvatarMock = sinon.mock(Avatar);
            AvatarMock.expects('findById').withArgs(mockAvatars[3]._id)
                .chain('exec')
                .resolves(stub());

            const promise = AvatarRepository.deleteAvatar(mockAvatars[3]._id);
            expect(promise).to.be.a('Promise');
            return promise.then(avatar => {
                expect(avatar).to.be.an('object');
                expect(stub.called).to.equal(true);
                stub.restore();
            });
        });
    });

    describe('makeAvatarModel()', function () {
        it('returns an avatar model', function () {
            const file = {
                originalName: 'default.png',
                mimetype: 'image/png',
                size: 62079,
                path: __dirname + '/../../../assets/male3.png'
            };
            const avatar = AvatarRepository.makeAvatarModel(file, mockAvatars[1].user, false);
            expect(avatar).to.exist;
            expect(avatar).to.have.property('_id');
            expect(avatar).to.have.property('user');
            expect(avatar).to.have.property('fileSize');
            expect(avatar).to.have.property('contentType');
            expect(avatar).to.have.property('defaultImg');
            expect(avatar).to.have.property('data');
            expect(avatar.defaultImg).to.be.false;
        });
    });

    describe('uploadAvatar()', function () {
        let file, stub, spy;
        beforeEach(() => {
            file = {
                originalName: 'default.png',
                mimetype: 'image/png',
                size: 62079,
                path: __dirname + '/../../../assets/male3.png'
            };
            stub = sinon.stub(Avatar.prototype, 'save');
            spy = sinon.spy(AvatarRepository, 'makeAvatarModel');
        });

        afterEach(() => {
            file = null;
            stub.restore();
            spy.restore();
        });

        it('generates the avatar model and saves to db', function () {
            const avatar = AvatarRepository.makeAvatarModel(file, mockAvatars[1].user, false);
            stub.resolves(avatar);

            return AvatarRepository.uploadAvatar(file, null, false)
                .then(response => {
                    expect(response).to.exist;
                    expect(response).to.have.property('_id');
                    expect(response).to.have.property('user');
                    expect(response).to.have.property('fileSize');
                    expect(response).to.have.property('contentType');
                    expect(response).to.have.property('defaultImg');
                    expect(response).to.have.property('data');
                    expect(response.user.toString()).to.equal(mockAvatars[1].user);

                    expect(spy.calledTwice).to.be.true;
                    expect(spy.secondCall.args.length).to.equal(3);
            });
        });

        it('catches an error if the avatar is unable to be saved to db', function () {
            stub.rejects(new Error('Oops, unable to save avatar to db'));

            return AvatarRepository.uploadAvatar(file, null, false)
                .then(() => { })
                .catch(err => {
                    expect(spy.calledOnce).to.be.true;
                    expect(spy.firstCall.args.length).to.equal(3);
                    expect(err).to.exist;
                });
        });
    });
});
