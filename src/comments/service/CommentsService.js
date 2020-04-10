export default class CommentsService {
    constructor(serviceEndpoint = '/', postId) {
        this.serviceEndpoint = serviceEndpoint.endsWith('/') ? serviceEndpoint : serviceEndpoint + '/';
        this.commentsHref = `${this.serviceEndpoint}post/${postId}/comments/`;
    }

    loadComments(href = '') {
        console.debug('Calling service for comments', this.commentsHref + href);
        return fetch(this.commentsHref + href)
                .then(data => data.json())
                .catch(err => console.error('Cannot load comments:', err));
    }

    loadAnswers(href) {
        console.debug('Calling service for answers', this.commentsHref + href);
        return fetch(this.commentsHref + href)
                .then(data => data.json())
                .catch(err => console.error('Cannot load answers:', err));
    }

    saveComment({name, message}) {
        console.debug('Calling service for saving a comment', this.commentsHref);
        return fetch(this.commentsHref, {
            method: 'POST',
            cache: 'no-cache',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formUrlEncoded({body: message, author: name})
        })
                .then(data => data.json())
                .then(d => {console.log('RETURNED COMMENT', d); return d;})
                .catch(err => console.error('Cannot save an comment:', err));
    }

    saveAnswer(commentId, {name, message}) {
        console.debug('Calling service for saving an answer', this.commentsHref + commentId);
        return fetch(this.commentsHref + commentId, {
            method: 'POST',
            cache: 'no-cache',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formUrlEncoded({body: message, author: name})
        })
                .then(data => data.json())
                .catch(err => console.error('Cannot save an answer:', err));
    }
}

function formUrlEncoded(x) {
    return Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');
}