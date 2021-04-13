import { required, confirmed, min, email } from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';

extend('required', {
    ...required,
    message: 'This field is required',
});

extend('email', {
    ...email,
    message: 'This field must be a valid email',
});

extend('confirmed', {
    ...confirmed,
    message: 'This field confirmation does not match',
});

extend('min', {
    ...min,
    message: 'This field requires more characters',
});
