function wait(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms)
    })
}



export default class CommentsService {
    constructor(serviceEndpoint) {
        this.serviceEndpoint = serviceEndpoint.endsWith('/') ? serviceEndpoint : serviceEndpoint + '/';
    }

    loadComments(next = 'server.json') {
        console.log('calling service', this.serviceEndpoint + next);
        return wait(1000).then(() =>
            fetch(this.serviceEndpoint + next)
                .then(data => data.json())
        );
    }

    loadAnswers(next) {
        console.log('calling service', this.serviceEndpoint + next);
        return wait(500).then(() =>
            fetch(this.serviceEndpoint + next)
                .then(data => data.json())

        );
    }

    leaveComment({name, message}) {
        console.log('calling service: leaveComment', name, message);
        // TODO
    }

    leaveAnswer(commentId, {name, message}) {
        console.log('calling service: leaveAnswer', commentId, name, message);
        // TODO
    }
}