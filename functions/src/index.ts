import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

enum UserRole {
    admin = 'admin',
    moderator = 'moderator',
}

exports.setRole = functions.https.onCall((data, context) => {
    if (!context.auth || context.auth.token[UserRole.admin] !== true) {
        return {
            error: 'Request not authorised!',
        };
    }
    if (!data.email || !data.role || ![UserRole.admin, UserRole.moderator].includes(data.role) || data.value == null) {
        return {
            error: 'Missing or invalid data',
        };
    }
    const email = data.email;
    return setRole(email, data.role, data.value).then(() => {
        return {
            result: `Request fulfilled! ${email} is now a ${data.role}`,
        };
    });
});

async function setRole(email: string, role: 'admin' | 'moderator', value: boolean): Promise<void> {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && (user.customClaims as any)[role] === value) {
        return;
    }
    return admin.auth().setCustomUserClaims(user.uid, {
        [role]: value,
    });
}
