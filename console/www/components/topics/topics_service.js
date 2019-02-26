/* global angular location */
function TopicsService($http) {
    this.url = `${location.protocol}//${location.host}`;
    this.http = $http;
    this.latest = [];
}

TopicsService.prototype.get_topic_list = function () {
    let self = this;
    return new Promise(function (resolve, reject) {
        self.http.get(`${self.url}/topics`)
            .then(function (d) {
                self.latest = d.data;
                resolve(d.data);
            }, function (e) {
                if (e.status === 404) {
                    resolve([]);
                } else {
                    console.log(`Error getting topic list ${e}`);
                    reject(e);
                }
            });
    });
};

TopicsService.prototype.create_topic = function (data) {
    let self = this;
    return new Promise(function (resolve, reject) {
        self.http.post(`${self.url}/topics`, JSON.stringify(data))
            .then(function (d) {
                resolve(d);
            });
    });
};

TopicsService.prototype.is_unique_valid_name = function (name) {
    let found = this.latest.some(function (item) {
        return item.name === name;
    });
    return (name && name.length > 0 && !found);
};

TopicsService.prototype.delete_topic = function (name) {
    let self = this;
    return new Promise(function (resolve, reject) {
        self.http.delete(`${self.url}/topics/${name}`)
            .then(function (d) {
                resolve(d);
            });
    });
};

TopicsService.prototype.delete_topic_list = function (names) {
    let self = this;
    return new Promise(function (resolve, reject) {
        Promise.all(names.map((name) => self.delete_topic(name)))
            .then(function () {
                if (self.latest.length === names.length) {
                    self.latest = [];
                }

                resolve();
            }, function (firstError) {
                reject(firstError);
            });
    });
};

TopicsService.prototype.get_topic_details = function (name) {
    return new Promise(function (resolve, reject) {
        resolve({ replicaIds: ['broker1', 'broker2'], syncReplicaIds: ['sync-broker-1'] });
    });
};

angular.module('topics_service', []).factory('topics_service', function ($http) {
    return new TopicsService($http);
});
