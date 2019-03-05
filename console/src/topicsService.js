class TopicsService {
  constructor() {
    this.url = `${window.location.protocol}//${window.location.host}`;
    this.latest = [];
  }

  getTopicList() {
    return new Promise((resolve, reject) => {
      if (window.location.port === '3001') {
        resolve(fakeTopics);
        return;
      }
      this.latest = [];
      fetch(`${this.url}/topics`)
        .then(response => {
          // fetch returns all non network error responses to the success handler
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          }
          // the REST API specifies a 404 return when there is an empty list
          if (response.status === 404) {
            return [];
          }
          // probably a 500 (server error)
          reject(Error(response.statusText));
          return [];
        })
        .then(json => {
          // keep the list in order to validate that new topic names are not duplicates
          this.latest = json;
          resolve(json);
        })
        // network error?
        .catch(error => {
          console.log('caught error in getTopicList');
          console.log(error);
          reject(error);
        });
    });
  }

  createTopic(data) {
    return new Promise((resolve, reject) => {
      fetch(`${this.url}/topics`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
        .then(res => {
          if (res.status < 200 || res.status > 299) {
            reject(Error(res.statusText));
          }
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  }

  isUniqueValidName(name) {
    const found = this.latest.some(item => item.name === name);
    return name.length > 0 && !found;
  }

  deleteTopic(name) {
    return new Promise((resolve, reject) => {
      fetch(`${this.url}/topics/${name}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (res.status >= 200 && res.status <= 299) {
            resolve(res);
          } else if (res.status === 404) {
            resolve([]);
          } else {
            reject(Error(res.statusText));
          }
        })
        .catch(res => {
          reject(res);
        });
    });
  }

  deleteTopicList(names) {
    return new Promise((resolve, reject) => {
      Promise.all(names.map(name => this.deleteTopic(name))).then(
        () => {
          resolve();
        },
        firstError => {
          reject(firstError);
        }
      );
    });
  }

  getTopicDetails(name) {
    return new Promise((resolve, reject) => {
      if (window.location.port === '3001') {
        resolve(fakeDetails);
        return;
      }
      fetch(`${this.url}/topics/${name}`)
        .then(response => {
          if (response.status < 200 || response.status > 299) {
            reject(Error(response.statusText));
            return;
          }
          const res = response.json();
          return res;
        })
        .then(myJson => {
          resolve(myJson);
        })
        // network error?
        .catch(error => reject(error));
    });
  }
}

let fakeTopics = [
  {
    name: 'a',
    partitions: [{ id: 0, leader: 1, replicas: [1], isr: [1] }],
    consumers: 0
  },
  {
    name: 'my-topic-2',
    partitions: [
      { id: 0, leader: 1, replicas: [1, 0, 2], isr: [1, 0, 2] },
      { id: 1, leader: 2, replicas: [2, 1, 0], isr: [2, 1, 0] },
      { id: 2, leader: 0, replicas: [0, 2, 1], isr: [0, 2, 1] }
    ],
    consumers: 0
  },
  {
    name: 'my-topic',
    partitions: [{ id: 0, leader: 1, replicas: [1], isr: [1] }],
    consumers: 0
  },
  {
    name: 'my-topic-3',
    partitions: [
      { id: 0, leader: 0, replicas: [0, 1, 2], isr: [0, 1, 2] },
      { id: 1, leader: 1, replicas: [1, 2, 0], isr: [1, 2, 0] },
      { id: 2, leader: 2, replicas: [2, 0, 1], isr: [2, 0, 1] }
    ],
    consumers: 0
  }
];

let fakeDetails = {
  name: 'my-topic',
  partitions: [
    {
      id: 0,
      leader: 0,
      replicas: [0, 1, 2],
      isr: [0, 1, 2]
    },
    {
      id: 1,
      leader: 1,
      replicas: [0, 1, 2],
      isr: [0, 1, 2]
    },
    {
      id: 2,
      leader: 2,
      replicas: [0, 1, 2],
      isr: [0, 1, 2]
    }
  ]
};

export default TopicsService;
