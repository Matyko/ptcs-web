import Vue from 'vue';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
    faAngleDown,
    faAngleLeft,
    faAngleRight,
    faArrowUp,
    faCaretDown,
    faCaretUp,
    faCheck,
    faCheckCircle,
    faExclamationCircle,
    faExclamationTriangle,
    faEye,
    faEyeSlash,
    faInfoCircle,
    faUpload,
    faSearch,
    faPlus,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
import {
    faGoogle,
} from '@fortawesome/free-brands-svg-icons';
library.add(
    faCheck,
    faCheckCircle,
    faInfoCircle,
    faExclamationTriangle,
    faExclamationCircle,
    faArrowUp,
    faAngleRight,
    faAngleLeft,
    faAngleDown,
    faEye,
    faEyeSlash,
    faCaretDown,
    faCaretUp,
    faUpload,
    faGoogle,
    faSearch,
    faPlus,
    faEdit,
);

Vue.component('vue-fontawesome', FontAwesomeIcon);
