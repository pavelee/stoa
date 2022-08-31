export const translations: Object = {
    'SIGN_IN': {
        'en': 'sign in',
        'pl': 'zaloguj się',
    },
    'SIGN_OUT': {
        'en': 'sign out',
        'pl': 'wyloguj się'
    },
    'NEW_THREAT_PLACEHOLDER': {
        'en': "What's on your mind?",
        'pl': "Masz jakiś pomysł?"
    },
    'NOLIKE': {
        'en': 'Do you support it?',
        'pl': 'czy popierasz temat?'
    },
    'LIKED': {
        'en': 'you support it!',
        'pl': 'popierasz temat!'
    },
    'LIKE': {
        'en': 'supporters',
        'pl': 'popierających'
    },
    'COMMENT': {
        'en': 'comments',
        'pl': 'komentarzy'
    },
    'VIEW': {
        'en': 'views',
        'pl': 'wyświetleń'
    },
    'COMMENT_PLACEHOLDER': {
        'en': 'write a reply',
        'pl': 'odpowiedz'
    },
    'DO_COMMENT': {
        'en': 'comment',
        'pl': 'skomentuj',
    },
    'SIGN_IN_COMMENT': {
        'en': 'sign in to comment',
        'pl': 'zaloguj się aby skomentować'
    },
    'SIGN_IN_LIKE': {
        'en': 'sign in to support',
        'pl': 'zaloguj się aby wesprzeć'
    },
    'NO_COMMENTS_YET': {
        'en': 'Noone commented yet, be first! 🚀',
        'pl': 'Nikt jeszcze nie skomentował, bądź pierwszy/a 🚀'
    },
    'FORM_NAME': {
        'en': 'Name',
        'pl': 'Nazwa'
    },
    'FORM_NAME_PALACEHOLDER': {
        'en': "What's your name?",
        'pl': 'Jak byś się nazwał?'
    }
}

export const translate = (key: string, language: string): string => {
    if (translations.hasOwnProperty(key) === false) {
        throw new Error(`key ${key} dosent exists in translations`);
    }
    if (translations[key].hasOwnProperty(language) === false) {
        throw new Error(`key ${key} dosent contain translation for language ${language}`);
    }

    return translations[key][language];
}