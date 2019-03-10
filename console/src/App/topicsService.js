/*
 * Copyright 2019 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class TopicsService {
  constructor() {
    this.url = `${window.location.protocol}//${window.location.host}`;
    this.latest = [];
  }

  getTopicList = () =>
    new Promise((resolve, reject) => {
      this.latest = [];
      const strategy = { '200': 'resolve', '404': 'reject', '500': 'reject' };
      poll(`${this.url}/topics`, strategy).then(
        res => {
          this.latest = res;
          resolve(res);
        },
        e => {
          reject(e);
        }
      );
    });

  createTopic = data =>
    new Promise((resolve, reject) => {
      console.log(` *** creating ${data.name} ***`);
      fetch(`${this.url}/topics`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      }).then(() => {
        const strategy = { '200': 'resolve', '404': 'wait', '500': 'reject' };
        poll(`${this.url}/topics/${data.name}`, strategy).then(
          res => {
            resolve(res);
          },
          e => {
            reject(e);
          }
        );
      });
    });

  deleteTopic = name =>
    new Promise((resolve, reject) => {
      console.log(` *** deleting ${name} ***`);
      fetch(`${this.url}/topics/${name}`, {
        method: 'DELETE'
      }).then(() => {
        const strategy = { '200': 'wait', '404': 'resolve', '500': 'reject' };
        poll(`${this.url}/topics/${name}`, strategy).then(
          res => {
            resolve(res);
          },
          e => {
            reject(e);
          }
        );
      });
    });

  isUniqueValidName(name) {
    const found = this.latest.some(item => item.name === name);
    return name.length > 0 && !found;
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
      fetch(`${this.url}/topics/${name} `)
        .then(response => {
          if (response.status < 200 || response.status > 299) {
            reject(Error(response.statusText));
            return {};
          }
          return response.json();
        })
        .then(myJson => {
          resolve(myJson);
        })
        // network error?
        .catch(error => reject(error));
    });
  }
}

// poll for a condition
const poll = (url, strategy, timeout, interval) => {
  const endTime = Number(new Date()) + (timeout || 10000);
  interval = interval || 1000;
  const s200 = strategy['200'];
  const s404 = strategy['404'];
  const s500 = strategy['500'];
  let lastStatus = 0;
  console.log('-------------------');
  console.log(`polling for ${url}`);

  const checkCondition = (resolve, reject) => {
    // If the condition is met, we're done!
    fetch(url)
      .then(res => {
        lastStatus = res.status;
        const ret = {};
        // decide whether to resolve, reject, or wait
        if (res.status >= 200 && res.status <= 299) {
          console.log(`received ${res.status} will ${s200}`);
          ret[s200] = res.json();
          return ret;
        } else if (res.status === 404) {
          console.log(`received 404 will ${s404}`);
          ret[s404] = [];
          return ret;
        }
        console.log(`received ${res.status} will ${s500}`);
        ret[s500] = res.status;
        return ret;
      })
      .then(json => {
        if (json.resolve) {
          resolve(json.resolve);
        } else if (json.reject) {
          reject(json.reject);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
          setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
          const msg = { message: 'timeout', status: lastStatus };
          console.log(msg);
          reject(new Error(JSON.stringify(msg)));
        }
      })
      .catch(e => {
        console.log(`poll caught error ${e}`);
        reject(e);
      });
  };
  return new Promise(checkCondition);
};

export default TopicsService;
