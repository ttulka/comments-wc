export default class CommentsService {
    constructor(serviceEndpoint = '/', postId) {
        this.serviceEndpoint = serviceEndpoint;
        this.commentsHref = `post/${postId}/comments`;
    }

    loadComments(href = this.commentsHref) {
        console.debug('Calling service for comments', new URL(href, this.serviceEndpoint));
        return fetch(new URL(href, this.serviceEndpoint).href)
                .then(data => data.json())
                .catch(err => console.error('Cannot load comments:', err));
    }

    loadAnswers(href) {
        console.debug('Calling service for answers', new URL(href, this.serviceEndpoint));
        return fetch(new URL(href, this.serviceEndpoint).href)
                .then(data => data.json())
                .catch(err => console.error('Cannot load answers:', err));
    }

    saveComment({name, message}) {
        console.debug('Calling service for saving a comment', new URL(this.commentsHref, this.serviceEndpoint));
        return fetch(new URL(this.commentsHref, this.serviceEndpoint).href, {
            method: 'POST',
            cache: 'no-cache',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: formUrlEncoded({body: message, author: name})
        })
                .then(data => data.json())
                .catch(err => console.error('Cannot save an comment:', err));
    }

    saveAnswer(commentId, {name, message}) {
        console.debug('Calling service for saving an answer', new URL(this.commentsHref, this.serviceEndpoint));
        return fetch(new URL(this.commentsHref + '/' + commentId, this.serviceEndpoint).href, {
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