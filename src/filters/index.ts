import Vue from 'vue';

Vue.filter('formatDate', (value: number) => {
    return Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).format(value);
});
