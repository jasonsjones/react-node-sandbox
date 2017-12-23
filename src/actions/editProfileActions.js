import AppDispatcher from '../dispatcher';

import * as dataservice from './dataservice';

export function updateUserProfile(newUserData) {
    AppDispatcher.handleViewAction({
        actionType: 'UPDATE_USER_PROFILE',
        data: true
    });

    dataservice.updateUserProfile(newUserData)
        .then(response => {
            if (response.success) {
                let currentUser = {
                    id: response.payload.user._id,
                    name: response.payload.user.name,
                    email: response.payload.user.email,
                    avatarUrl: response.payload.user.avatarUrl,
                    sfdcAuth: !!response.payload.user.sfdc
                };
                AppDispatcher.handleViewAction({
                    actionType: "UPDATE_USER_PROFILE_SUCCESS",
                    data: {
                        user: currentUser
                    }
                });
            }
        })
        .catch(err => {
            AppDispatcher.handleViewAction({
                actionType: "UPDATE_USER_PROFILE_ERROR",
                data: err
            });
        });

}
